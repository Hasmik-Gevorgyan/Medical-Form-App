import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { getSpecifications } from '@/features/specificationSlice';
import type { AppDispatch, RootState } from '@/app/store';
import { getHospitals } from '@/features/hospitalsSlice';
import { fetchUser } from '@/features/authSlice';
import { router } from "@/routes";
import '@/App.css'

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const antdThemeAlgorithm = mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;

  useEffect(() => {
    dispatch(getSpecifications());
  }, []);

  useEffect(() => {
    dispatch(getHospitals());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch(fetchUser(user?.uid));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
  }, [mode]);

  return (
      <ConfigProvider theme={{ algorithm: antdThemeAlgorithm }}>
        <RouterProvider router={router} />
      </ConfigProvider>
  )
}

export default App
