import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { App as AntdApp,ConfigProvider, theme as antdTheme, message } from 'antd';
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
import useAuth from '@/hooks/useAuth';

import '@/App.css';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useThemeMode();
  const { isLoggedIn, user} = useAuth();

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

  useEffect(() => {
    if (isLoggedIn && !user?.certified) {
      message.info(
        `Your profile is not yet certified. Please upload your medical certificate from your
        profile and become visible to patients`,
        5
      )
    }
}, [isLoggedIn]);


  return (
    <ConfigProvider
      theme={{
        token: themes[theme].antd,
        algorithm,
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
