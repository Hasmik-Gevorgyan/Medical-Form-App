import type {PayloadAction} from "@reduxjs/toolkit";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import DoctorService from "../services/doctor.service.ts";
import type {
    CertificateModel,
    DoctorInfoModel,
    DoctorStateModel,
    PaginatedDoctorsResponse
} from "../models/doctor.model.ts";
import {Status} from "../constants/enums.ts";

interface ApiError {
    message: string;
}

const initialState: DoctorStateModel = {
    doctors: [],
    doctorsByPage: {total: 0, doctors: []},
    doctor: {},
    certificates: [],
    selectedSpecificationId: '',
    searchQuery: '',
    status: Status.IDLE,
    error: null,
}

const doctorService = DoctorService();

export const getDoctors = createAsyncThunk<
    DoctorInfoModel[],
    void,
    { rejectValue: ApiError }
>(
    'doctors/getDoctors',
    async (_, {rejectWithValue}) => {
        try {
            return await doctorService.getDoctors();
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to fetch doctors'});
        }
    }
)

export const getDoctorsByPage = createAsyncThunk<
    PaginatedDoctorsResponse,
    { page: number; specificationId: string, searchQuery?: string; },
    { rejectValue: ApiError }
>(
    'doctors/getDoctorsByPage',
    async ({page, specificationId, searchQuery}, {rejectWithValue}) => {
        try {
            return await doctorService.getDoctorsByPage(page, specificationId, searchQuery);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to search doctors by page'});
        }
    }
)


export const getDoctor = createAsyncThunk<
    DoctorInfoModel,
    string,
    { rejectValue: ApiError }
>(
    'doctors/getDoctor',
    async (id: string, {rejectWithValue}) => {
        try {
            const doctor = await doctorService.getDoctor(id);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            return doctor;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to fetch doctor'});
        }
    }
)
export const updateConsultationPrice = createAsyncThunk<
    DoctorInfoModel,
    { doctorId: string; price: string },
    { rejectValue: ApiError }
>(
    'doctors/updateConsultationPrice',
    async ({doctorId, price}, {rejectWithValue}) => {
        try {
            const updatedDoctor = await doctorService.updateConsultationPrice(doctorId, price);
            if (!updatedDoctor) {
                throw new Error("Doctor not found after update");
            }
            return updatedDoctor;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({message: err.message});
            }
            return rejectWithValue({message: 'Failed to update consultation price'});
        }
    }
);

export const getDoctorCertificates= createAsyncThunk<
    CertificateModel[],
    string,
    { rejectValue: ApiError }
>(
    'doctors/getCertificates',
    async (doctorId: string, { rejectWithValue }) => {
        try {
            const urls = await doctorService.getDoctorCertificates(doctorId);
            return urls.map((url) => ({ url }));
        } catch (err: unknown) {
            if (err instanceof Error) {
                return rejectWithValue({ message: err.message });
            }
            return rejectWithValue({ message: 'Failed to fetch certificates' });
        }
    }
);


const doctorSlice = createSlice({
    name: 'doctors',
    initialState,
    reducers: {
        setFilter: (state: DoctorStateModel, action: PayloadAction<string>): void => {
            state.selectedSpecificationId = action.payload;
        },
        setSearchQuery(state: DoctorStateModel, action: PayloadAction<string>): void {
            state.searchQuery = action.payload;
        },
        clearDoctorError(state: DoctorStateModel) {
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getDoctors.pending, (state: DoctorStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getDoctors.fulfilled, (state: DoctorStateModel, action: PayloadAction<DoctorInfoModel[]>): void => {
                state.status = Status.SUCCEEDED;
                state.doctors = action.payload;
            })
            .addCase(getDoctors.rejected, (state: DoctorStateModel, action: ReturnType<typeof getDoctors.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
            .addCase(getDoctorsByPage.pending, (state: DoctorStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getDoctorsByPage.fulfilled, (state: DoctorStateModel, action: PayloadAction<PaginatedDoctorsResponse>): void => {
                state.status = Status.SUCCEEDED;
                state.doctorsByPage = {
                    doctors: action.payload.doctors,
                    total: action.payload.total,
                };
            })
            .addCase(getDoctorsByPage.rejected, (state: DoctorStateModel, action: ReturnType<typeof getDoctorsByPage.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
            .addCase(getDoctor.pending, (state: DoctorStateModel): void => {
                state.status = Status.LOADING;
            })
            .addCase(getDoctor.fulfilled, (state: DoctorStateModel, action: PayloadAction<DoctorInfoModel>): void => {
                state.status = Status.SUCCEEDED;
                state.doctor = action.payload;
            })
            .addCase(getDoctor.rejected, (state: DoctorStateModel, action: ReturnType<typeof getDoctor.rejected>): void => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
            .addCase(updateConsultationPrice.pending, (state) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(updateConsultationPrice.fulfilled, (state, action) => {
                state.status = Status.SUCCEEDED;
                state.doctor = action.payload;
            })
            .addCase(updateConsultationPrice.rejected, (state, action) => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload?.message;
                } else {
                    state.error = action.error?.message || null;
                }
            })
            .addCase(getDoctorCertificates.pending, (state: DoctorStateModel) => {
                state.status = Status.LOADING;
                state.error = null;
            })
            .addCase(getDoctorCertificates.fulfilled, (state: DoctorStateModel, action) => {
                state.status = Status.SUCCEEDED;
                state.certificates = action.payload;
            })
            .addCase(getDoctorCertificates.rejected, (state: DoctorStateModel, action) => {
                state.status = Status.FAILED;
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error?.message || null;
                }
            });
    }
})

export const {setFilter, setSearchQuery, clearDoctorError} = doctorSlice.actions;
export default doctorSlice.reducer;