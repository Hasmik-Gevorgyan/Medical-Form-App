import {
  MenuOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Space,
  Avatar,
  Dropdown,
  Divider,
  Typography,
  Skeleton,
  Modal,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { toggleTheme } from '@/features/themeSlice';
import { logoutUser } from '@/services/auth.service';
import { fetchUser } from '@/features/authSlice';
import useAuth from '@/hooks/useAuth';
import { ROUTE_PATHS } from '@/routes/paths';
import type { AppDispatch } from '@/app/store';

import '@/assets/styles/header.scss';
import logo from '@/assets/images/logo.png';
import useThemeMode from '@/hooks/useThemeMode';
import {pageLinks, guestLinks, profileMenu} from '@/constants/headerMenu';

const { Header } = Layout;
const { Title, Text } = Typography;
  
const MainHeader: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { theme } = useThemeMode();

  const { isLoggedIn, isLoading } = useAuth();

  const handleDrawerClose = () => setDrawerOpen(false);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'appointment') {
      setAppointmentModalOpen(true);
    }
    setDrawerOpen(false)
  };
  const ThemeToggleButton = (
    <Button
      type="primary"
      ghost={theme === 'light'}
      className="theme-toggle-button"
      // type="text"
      shape="circle"
      icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
      onClick={() => dispatch(toggleTheme())}
    />
  );

  const handleDropdownClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      Modal.confirm({
        content: (
          <div style={{ textAlign: 'center' }}>
            <Text strong style={{ fontSize: 16 }}>
              Are you sure you want to logout?
            </Text>
          </div>
        ),
        okText: 'Logout',
        icon: null,
        cancelText: 'Cancel',
        centered: true,
        footer: (_, { OkBtn, CancelBtn }) => (
          <div style={{ textAlign: 'center' }}>
            <Space>
              <CancelBtn />
              <OkBtn />
            </Space>
          </div>
        ),
        onOk: () => {
          navigate(ROUTE_PATHS.HOME);
          setTimeout(() => {
            logoutUser();
            dispatch(fetchUser(undefined));
          }, 100);
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
          items={pageLinks}
          onClick={handleMenuClick}
        />

        <Modal
          open={isAppointmentModalOpen}
          onCancel={() => setAppointmentModalOpen(false)}
          footer={null}
          title="Appointment"
        >
          {/* Modal content here */}
        </Modal>
      </div>
      <Space>
        <div className="desktop-menu">{ThemeToggleButton}</div>

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
            <Avatar className="profile-avatar" icon={<UserOutlined />} />
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
        className="mobile-drawer"
        title="Menu"
        placement="left"
        onClose={handleDrawerClose}
        open={drawerOpen}
        footer={
          <div style={{ padding: '16px 12px' }}>
            {!isLoggedIn && (
              <>
                <Space className="guest-links" direction="vertical" style={{ width: '100%' }}>
                  {guestLinks.map((item) => (
                    <div key={item.key}>{item.label}</div>
                  ))}
                </Space>
                <Divider />
              </>
            )}

            <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontWeight: 500 }}>Theme Mode:</span> {ThemeToggleButton}
            </Space>
          </div>
        }
      >
        <Menu
          mode="vertical"
          items={pageLinks.map((item) => ({
            ...item,
            label: <span style={{ fontWeight: 500, fontSize: 16 }}>{item.label}</span>,
          }))}
          onClick={handleMenuClick}
        />
      </Drawer>

    </Header>
  );
};

export default MainHeader;
