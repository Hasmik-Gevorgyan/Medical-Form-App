import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/firebase/config';
import { fetchUser } from '@/features/authSlice';
import { getHospitals } from '@/features/hospitalsSlice';
import { getSpecifications } from '@/features/specificationSlice';
import { applyCSSVariables } from '@/theme/applyTheme';
import { themes } from '@/theme/theme';
import { router } from '@/routes';
import type { AppDispatch } from '@/app/store';
import useThemeMode from '@/hooks/useThemeMode';

import '@/App.css';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useThemeMode();

  const algorithm = theme === 'dark'
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm;

  // Fetch hospitals and specifications on mount
  useEffect(() => {
    dispatch(getHospitals());
    dispatch(getSpecifications());
  }, [dispatch]);

  // Sync theme variables with custom CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    applyCSSVariables(themes[theme].cssVars);
  }, [theme]);

  // Watch auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(fetchUser(user?.uid));
    });
    return unsubscribe;
  }, [dispatch]);

  console.log('Current theme:', theme);

  return (
    <ConfigProvider
      theme={{
        token: themes[theme].antd,
        algorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
