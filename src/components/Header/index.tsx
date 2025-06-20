import { useState } from 'react';

import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { toggleTheme } from '@/features/themeSlice';
import useAuth from '@/hooks/useAuth';
import { fetchUser } from '@/features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { MenuOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Drawer, Button, type MenuProps, Space, Avatar, Dropdown, Typography, Skeleton, Modal } from 'antd';

import  '@/assets/styles/header.scss';
import logo from '@/assets/images/logo.png';
import useThemeMode from '@/hooks/useThemeMode';
import {pageLinks, guestLinks, profileMenu} from '@/constants/headerMenu';
import CodeModal from '@/components/CodeChecker';
import { logoutUser } from '@/services/auth.service';

const { Header } = Layout;
const { Title } = Typography;

const MainHeader = () => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {theme} = useThemeMode();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onMenuClick: MenuProps['onClick'] = () => {
    setDrawerOpen(false);
  };

  const handleMenuClick = (e: { key: string }) => {
	if (e.key === 'appointment') {
      setAppointmentModalOpen(true);
    }
  };

  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: 'Are you sure you want to logout?',
        icon: null,
        okText: 'Logout',
        cancelText: 'Cancel',
        className: "logout-modal",
        okType: 'primary',
        onOk: () => {
          navigate('/');

          setTimeout(()=>{
            logoutUser();
            dispatch(fetchUser(undefined));
          },100)
        },
      });
    }
  };

  return (
    <Header className="layout-header">
      <Button
        ghost={theme === 'light'}
        icon={<MenuOutlined />}
        onClick={() => setDrawerOpen(true)}
        className="mobile-menu"
      />
      <Title className="logo-title" level={4}>
        <Link to="/">
          <img src={logo} alt="Medical Consulting Logo" className="logo-image" /> 
          <span className="logo-text">Medical Consulting</span>
          </Link>
      </Title>
      <div className="menu-page-links desktop-menu">
        <Menu
          mode="horizontal"
          items={pageLinks.filter(page => !page.isProtected || page.isProtected && isLoggedIn)}
          onClick={handleMenuClick}
		  onTouchStart={() => handleMenuClick({ key: 'appointment' })}
        />
        <CodeModal 
          open={isAppointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
        />
      </div>

      <Space>
        <Button
          className='desktop-menu theme-toggle-button'
          type="text"
          shape="circle"
          icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
          onClick={() => dispatch(toggleTheme())}
        />
        {isLoading ? (
          <div className="desktop-menu">
            <Skeleton.Avatar 
              active 
              shape="circle" 
              className='skeleton-avatar'
            />
          </div>
        ) : isLoggedIn ? (
          <Dropdown
            className='profile-dropdown-container'
            overlayClassName="profile-dropdown"
            menu={{ items: profileMenu as any, onClick: handleDropdownClick }}
            placement="bottomRight"
          >
            {user?.photoUrl ? (
              <Avatar className="profile-avatar" src={user.photoUrl} />
            ) : (
              <Avatar className="profile-avatar" icon={<UserOutlined />} />
            )}
          </Dropdown>
        ) : (
          <div className="desktop-menu">
            <Space>
              {guestLinks.map((item) => (
                <div key={item.key}>{item.label}</div>
              ))}
            </Space>
          </div>
        )}
      </Space>
      <Drawer
        className='mobile-drawer'
        title="Menu"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Menu
          mode="vertical"
          onClick={onMenuClick}
          items={pageLinks}
        />
        <div style={{ flexGrow: 1 }} />
        {!isLoggedIn &&
            <Space className='guest-links'>
                {guestLinks.map((item) => (
                    <div key={item?.key}>{item?.label}</div>
                ))}
            </Space>
        }
        <Space >
          Theme Mode:
          <Button
            className='theme-toggle-button'
              type="text"
              shape="circle"
              icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
              onClick={() => dispatch(toggleTheme())}
          />
        </Space>
      </Drawer>
    </Header>
  )
}

export default MainHeader;
