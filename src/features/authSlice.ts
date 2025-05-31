import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {DoctorInfoModel} from "@/models/doctor.model";
import DoctorService from "@/services/doctor.service";

interface AuthState {
  user: DoctorInfoModel | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const doctorService = DoctorService();

export const fetchUser = createAsyncThunk<DoctorInfoModel, string>(
  "doctors/getDoctor",
  async (uid: string, { rejectWithValue }) => {
    try {
      const user = await doctorService.getDoctor(uid);
      if (!user) {
        return rejectWithValue("User not found");
      }
      return user;
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<DoctorInfoModel>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export default authReducer.reducer;
