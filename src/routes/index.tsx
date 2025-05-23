import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>,
  }, 
  {
    path: '/form',
    element: <div>Form</div>,
  }, 
  {
    path: '/login',
    element: <div>Login form</div>
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
