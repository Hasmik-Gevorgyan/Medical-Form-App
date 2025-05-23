import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import articleReducer from '../features/articleSlice.ts';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    articles: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
