
import { createBrowserRouter, Navigate } from 'react-router-dom';
import {ROUTE_PATHS} from "./paths.ts";
import Doctors from "../pages/Doctors";
import DoctorInfo from "../pages/DoctorInfo";

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
    element: <div>Login form</div>
  },
  {
    path: ROUTE_PATHS.DOCTORS,
    element: <Doctors />
  },
  {
    path: ROUTE_PATHS.DOCTOR_INFO,
    element: <DoctorInfo />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
