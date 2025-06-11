import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@/routes/paths';

export const pageLinks = [
  { key: 'dashboard', label: <Link to={ROUTE_PATHS.DOCTOR_QUERIES}>Dashboard</Link>, isProtected: true },
  // { key: 'home', label: <Link to="/">Home</Link> },
  { key: 'doctors', label: <Link to={ROUTE_PATHS.DOCTORS}>Doctors</Link>, isProtected: false },
  { key: 'articles', label: <Link to={ROUTE_PATHS.ARTICLES}>Articles</Link>, isProtected: false },
  { key: 'session', label: <Link to={ROUTE_PATHS.REQUEST}>Book An Appointment</Link>, isProtected: false },
  { key: 'appointment', label: 'My Appointment', isProtected: false},
  {
    key: 'about-us',
    label: <Link to={ROUTE_PATHS.ABOUT_US}>About Us</Link>,
  },
];
  
export const guestLinks = [
  {
    key: 'login',
    label: (
      <Link to={ROUTE_PATHS.LOGIN}>
        <Button icon={<LoginOutlined />}>Login</Button>
      </Link>
    ),
  },
  {
    key: 'register',
    label: (
      <Link to={ROUTE_PATHS.REGISTER}>
        <Button type="primary">Register</Button>
      </Link>
    ),
  },
];
  
export const profileMenu = [
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: <Link to={ROUTE_PATHS.DOCTOR_PROFILE}>Profile</Link>,
  },
  {
    key: 'my-articles',
    icon: <UnorderedListOutlined />,
    label: <Link to={ROUTE_PATHS.MY_ARTICLES}>My Articles</Link>,
  },
  {
    type: 'divider',
    icon: null,
    label: null,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
];
  