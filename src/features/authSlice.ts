import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {DoctorInfoModel} from "@/models/doctor.model";
import DoctorService from "@/services/doctor.service";
import {Status} from "@/constants/enums.ts";

interface AuthState {
  user: DoctorInfoModel | null;
  status: Status;
}

const initialState: AuthState = {
  user: null,
  status: Status.LOADING,
};

const doctorService = DoctorService();

export const fetchUser = createAsyncThunk<DoctorInfoModel, string | undefined>(
  "user/fetchUser",
  async (uid: string | undefined, { rejectWithValue }) => {
    try {
      if (!uid) {
        return rejectWithValue("User ID is required");
      }
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
        state.status = Status.LOADING;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<DoctorInfoModel>) => {
        state.user = action.payload
        state.status = Status.SUCCEEDED;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.status = Status.FAILED;
      });
  },
});

export default authReducer.reducer;
