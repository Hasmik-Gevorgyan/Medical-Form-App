import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import doctorReducer from '../features/doctorSlice.ts';


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    doctors: doctorReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
