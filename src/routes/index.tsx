
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import MainLayout from '@/components/Layout';
import {ROUTE_PATHS} from "./paths.ts";
import Doctors from "@/pages/Doctors";
import DoctorInfo from "@/pages/DoctorInfo";
import Articles from '@/pages/Articles/index.tsx';
import ArticleForm from '@/pages/ArticleForm/index.tsx';
import ArticleDetail from "@/pages/ArticleDetail/index.tsx";
import PrivateRoute from "@/components/PrivateRoute";
import Profile from '@/pages/Profile/index.tsx';
import ResponsePage from '@/pages/responsePage.tsx';
import { RequestPage } from '@/pages/requestPage.tsx';
import EditArticle from "@/components/EditArticle";
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home/>,
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
		path: ROUTE_PATHS.REQUEST,
		element: <RequestPage />
	  },
	  {
		path: ROUTE_PATHS.RESPONSE,
		element: <ResponsePage />
	  },
      {
        path: ROUTE_PATHS.ARTICLES,
        element: <Articles/>
      },
      {
        path: ROUTE_PATHS.ARTICLE_DETAIL,
        element: <ArticleDetail />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: ROUTE_PATHS.ADD_ARTICLE,
            element: <ArticleForm/>
          },
          {
            path: ROUTE_PATHS.DOCTOR_PROFILE,
            element:<Profile />
          },
          {
            path: ROUTE_PATHS.EDIT_ARTICLE,
            element: <EditArticle/>
          },
        ]
      },
    ],
  },
  {
    path: ROUTE_PATHS.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to={ROUTE_PATHS.HOME} replace />,
  }
]);
