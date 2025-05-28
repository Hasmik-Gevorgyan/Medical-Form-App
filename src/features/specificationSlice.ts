import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {Status} from "../constants/enums.ts";
import type {SpecificationModel, SpecificationStateModel} from "../models/specification.model.ts";
import SpecificationService from "../services/specification.service.ts";

interface ApiError {
    message: string;
}

const initialState: SpecificationStateModel = {
    specifications: [],
    status: Status.IDLE,
    error: null,
}

const specificationService = SpecificationService();

export const getSpecifications = createAsyncThunk<
    SpecificationModel[],
    void,
    { rejectValue: ApiError }
>(
    'specifications/getSpecifications',
    async (_, {rejectWithValue}) => {
        try {
            return await specificationService.getSpecifications();
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to fetch doctors'});
        }
    }
)

const specificationSlice = createSlice({
    name: 'specifications',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getSpecifications.pending, (state: SpecificationStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getSpecifications.fulfilled, (state: SpecificationStateModel, action: PayloadAction<SpecificationModel[]>): void => {
                state.status = Status.SUCCEEDED;
                console.log(action.payload)
                state.specifications = action.payload;
            })
            .addCase(getSpecifications.rejected, (state: SpecificationStateModel, action: ReturnType<typeof getSpecifications.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
    }
})

export default specificationSlice.reducer;