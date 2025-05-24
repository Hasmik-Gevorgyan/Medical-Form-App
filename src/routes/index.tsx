import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RequestPage } from '../pages/requestPage';
import ResponsePage from '../pages/responsePage';

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
		path: '/request/doctor/:doctorId',
		element: <RequestPage />
	},
	{
		path: '/response/doctor/:doctorId/:requestId',
		element: <ResponsePage />
	},
	{
		path: '*',
		element: <Navigate to="/" replace />,
	}
]);
