import { createSlice } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
  mode: Theme;
}

const savedTheme = localStorage.getItem('theme') || 'light';

const initialState: ThemeState = {
  mode: savedTheme === 'dark' ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
    },
    setTheme(state, action) {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
