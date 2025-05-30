import { createBrowserRouter, Navigate } from 'react-router-dom';
import Articles from "../pages/Articles/index.tsx";
import ArticleForm from "../components/ArticleForm/index.tsx";
import ArticleDetail from "../components/ArticleDetail/index.tsx";
import Doctors from '../pages/Doctors/index.tsx';
import DoctorInfo from '../pages/DoctorInfo/index.tsx';
import {ROUTE_PATHS} from "./paths.ts";

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
  },
  {
    path: ROUTE_PATHS.ARTICLES,
    element: <Articles/>
  },
  {
    path: ROUTE_PATHS.ADD_ARTICLE,
    element: <ArticleForm/>
  },
  {
    path: ROUTE_PATHS.ARTICLE_DETAIL,
    element: <ArticleDetail />
  }
]);
