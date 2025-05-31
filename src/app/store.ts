import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '@/features/themeSlice';
import authReducer from "@/features/authSlice";
import doctorReducer from '@/features/doctorSlice.ts';
import specificationReducer from '@/features/specificationSlice.ts';
import hospitalsReducer from '@/features/hospitalsSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    doctors: doctorReducer,
    specifications: specificationReducer,
    hospitals: hospitalsReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
