import { LoginOutlined, LogoutOutlined, MenuOutlined, MoonOutlined, SunOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Drawer, Button, type MenuProps, Space, Avatar, Dropdown, Divider, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { AppDispatch, RootState } from '@/app/store';
import { logoutUser } from '@/services/auth.service';
import { toggleTheme } from '@/features/themeSlice';
import useAuth from '@/hooks/useAuth';
import  '@/assets/styles/header.scss';
import AIChatModal from '@/ai/AIComponent';

const { Header } = Layout;
const { Title } = Typography;

interface ProfileMenuItem {
    key: string;
    icon?: React.ReactNode;
    label: React.ReactNode | string;
}
const profileMenu: ProfileMenuItem[] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
];

const pageLinks: ProfileMenuItem[] = [
    { key: 'home', label: <Link to="/"> Home</Link> },
    { key: 'doctors', label: <Link to="/doctors">Doctors</Link> },
    { key: 'articles', label: <Link to="/articles">Articles</Link> },
    { key: 'session', label: <Link to="/session">Register A Session</Link> },
];

const guestLinks: ProfileMenuItem[] = [
    { key: 'login', label: <Link to="/login">
        <Button icon={<LoginOutlined />}>Login</Button>
        </Link> },
    { key: 'register', label: <Link to="/register">
        <Button type="primary">Register</Button>
        </Link> },
];

const MainHeader: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth()

    const theme = useSelector((state: RootState) => state.theme.mode);
    
    const onMenuClick: MenuProps['onClick'] = () => {
        setDrawerOpen(false);
    };
    
    const handleMenuClick = ({ key }: { key: string }) => {
        if (key === 'logout') {
            logoutUser();
            window.location.reload();
        }
    };

    return (
        <Header className="layout-header">
            <Button icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} className="mobile-menu" />
            <Title className='logo-title' level={4}>
                <Link to="/">
                    🏥 Medical Consulting
                </Link>
            </Title>
            <div className='desktop-menu'>
                <Space split={<Divider type="vertical" />}>
                    {pageLinks.map((item) => (
                        <div key={item.key} className='page-link'>{ item.label}</div>
                    ))}
                </Space>
            </div>

            <Space>
                <Button
                    className='desktop-menu'
                    type="text"
                    shape="circle"
                    icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
                    onClick={() => dispatch(toggleTheme())}
                />
                {user ? (
                    <Dropdown menu={{ items: profileMenu, onClick: handleMenuClick }} placement="bottomRight">
                        <Avatar className='profile-avatar' icon={<UserOutlined />} />
                    </Dropdown>
                ) : (
                    <div className='desktop-menu'>
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
                    {!user &&
                        <Space className='guest-links'>
                            {guestLinks.map((item) => (
                                <div key={item?.key}>{item?.label}</div>
                            ))}
                        </Space>
                    }
                     <Space >
                        Theme Mode:
                        <Button
                            type="text"
                            shape="circle"
                            icon={theme === 'dark' ? <MoonOutlined /> : <SunOutlined />}
                            onClick={() => dispatch(toggleTheme())}
                        />
                    </Space>
            </Drawer>
    </Header>
    );
}   
export default MainHeader;

