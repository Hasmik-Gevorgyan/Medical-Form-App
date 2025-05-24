import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DoctorProfileView from '../pages/DoctorProfileView'; // <--- замени на просмотр
import DrProfile from '../pages/DrProfileEdit'; // редактирование, можно оставить если по ID
// другие импорты...

const Home = () => (
  <div>
    <h1>Home</h1>
    <Link to='/doctor-profile/:id'>
      <button>Go to Doctor Profile</button>
    </Link>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/form',
    element: <div>Form</div>,
  },
  {
    path: '/login',
    element: <div>Login form</div>,
  },
 
 {
    path: '/doctor-profile/:id',
    element: <DoctorProfileView />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
