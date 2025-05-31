import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import authReducer from "@/features/authSlice";
import doctorReducer from '../features/doctorSlice.ts';
import reviewReducer from '../features/reviewSlice.ts';
import specificationReducer from '../features/specificationSlice.ts';
import hospitalsReducer from '@/features/hospitalsSlice.ts';
import articleReducer from '@/features/articleSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    doctors: doctorReducer,
    reviews: reviewReducer,
    specifications: specificationReducer,
    hospitals: hospitalsReducer,
    articles: articleReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
