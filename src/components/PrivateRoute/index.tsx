import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import { Modal } from 'antd';

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const modalShownRef = useRef(false);

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    if (!modalShownRef.current) {
      modalShownRef.current = true;

      Modal.confirm({
        title: 'Login Required',
        content: 'You must be logged in to view this page. Do you want to go to the login page?',
        okText: 'Login',
        cancelText: 'Cancel',
        onOk: () => {
          navigate('/login', {
            state: { from: location.pathname },
            replace: true,
          });
        },
        onCancel: () => {
          navigate(-1);
        },
      });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  return isLoggedIn ? <Outlet /> : null;
};

export default PrivateRoute;
