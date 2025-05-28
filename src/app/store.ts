import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import doctorReducer from '../features/doctorSlice.ts';
import specificationReducer from '../features/specificationSlice.ts';


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    doctors: doctorReducer,
    specifications: specificationReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
