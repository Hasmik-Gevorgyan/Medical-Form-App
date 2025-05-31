import type {PayloadAction} from "@reduxjs/toolkit";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {FieldErrors, ReviewModel, ReviewStateModel} from "../models/review.model.ts";
import {Status} from "../constants/enums.ts";
import ReviewService from "@/services/review.service.ts";

interface ApiError {
    message: string;
    fieldErrors?: FieldErrors
}

const initialState: ReviewStateModel = {
    reviews: [],
    status: Status.IDLE,
    error: null,
    fieldErrors: {}
}

const reviewService = ReviewService();

export const getReviews = createAsyncThunk<
    ReviewModel[],
    string,
    { rejectValue: ApiError }
>(
    'reviews/getReviews',
    async (doctorId, {rejectWithValue}) => {
        try {
            return await reviewService.getDoctorReviews(doctorId);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to fetch doctors'});
        }
    }
)

export const addReview = createAsyncThunk<
    ReviewModel,
    Omit<ReviewModel, 'id' | 'createdAt'>,
    { rejectValue: ApiError }
>(
    'doctors/addReview',
    async (review, {rejectWithValue}) => {
        try {
            return await reviewService.addDoctorReview(review);
        } catch (err: any) {
            const fieldErrors = err.fieldErrors as FieldErrors;
            if (fieldErrors) {
                return rejectWithValue({message: err.message, fieldErrors});
            }
            return rejectWithValue({message: 'Failed to add review'});
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearFieldError(state, action: PayloadAction<keyof FieldErrors>) {
            delete state.fieldErrors[action.payload];
        },
        clearFieldErrors(state) {
            state.fieldErrors = {};
        },
    },
    extraReducers: builder => {
        builder
            .addCase(addReview.pending, (state: ReviewStateModel): void => {
                state.status = Status.LOADING;
                state.error = null;
                state.fieldErrors = {};
            })
            .addCase(addReview.fulfilled, (state: ReviewStateModel, action: PayloadAction<ReviewModel>): void => {
                state.status = Status.SUCCEEDED;
                state.reviews.push(action.payload);
                state.fieldErrors = {};
                state.error = null;
            })
            .addCase(addReview.rejected, (state: ReviewStateModel, action: ReturnType<typeof addReview.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload && action.payload.fieldErrors) {
                    state.fieldErrors = action.payload.fieldErrors;
                }

                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
            .addCase(getReviews.pending, (state: ReviewStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getReviews.fulfilled, (state: ReviewStateModel, action: PayloadAction<ReviewModel[]>): void => {
                state.status = Status.SUCCEEDED;
                state.reviews = action.payload;
            })
            .addCase(getReviews.rejected, (state: ReviewStateModel, action: ReturnType<typeof getReviews.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
    }
})

export const {clearFieldError, clearFieldErrors} = reviewSlice.actions;
export default reviewSlice.reducer;