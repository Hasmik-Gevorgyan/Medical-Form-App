import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {Status} from "@/constants/enums.ts";
import type {HospitalModel, HospitalStateModel} from "@/models/hospitals.model.ts";
import HospitalsService from "@/services/hospitals.service.ts";

interface ApiError {
    message: string;
}

const initialState: HospitalStateModel = {
    hospitals: [],
    status: Status.IDLE,
    error: null,
}

const hospitalsService = HospitalsService();

export const getHospitals = createAsyncThunk<
    HospitalModel[],
    void,
    { rejectValue: ApiError }
>(
    'hospitals/getHospitals',
    async (_, {rejectWithValue}) => {
        try {
            return await hospitalsService.getHospitals();
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to fetch doctors'});
        }
    }
)

const hospitalsSlice = createSlice({
    name: 'hospitals',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getHospitals.pending, (state: HospitalStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getHospitals.fulfilled, (state, action: PayloadAction<HospitalModel[]>) => {
                state.status = Status.SUCCEEDED;
                state.hospitals = action.payload;
            })
            .addCase(getHospitals.rejected, (state: HospitalStateModel, action: ReturnType<typeof getHospitals.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
    }
})

export default hospitalsSlice.reducer;