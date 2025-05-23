import { createBrowserRouter, Navigate } from 'react-router-dom';
import Articles from "../pages/Articles.tsx";
import ArticleForm from "../components/ArticleForm.tsx";

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
  },
  {
    path: '/articles',
    element: <Articles/>
  },
  {
    path: '/add-article',
    element: <ArticleForm/>
  }
]);
