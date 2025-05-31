import React, { useState } from 'react';
import { Layout, Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { toggleTheme } from '@/features/themeSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';

const { Header, Content } = Layout;

const items: MenuProps['items'] = [
  { key: '/', label: 'Home' },
  { key: '/about', label: 'About' },
  { key: '/contact', label: 'Contact' },
];

const MainLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    setDrawerOpen(false);
  };

  return (
    <div>
      <Header className="layout-header">
        <div className="logo">MyApp</div>

        <Button type="primary" onClick={() => dispatch(toggleTheme())}>
          Toggle Theme
        </Button>
        <div className="mobile-menu">
          <Button icon={<MenuOutlined />} onClick={() => setDrawerOpen(true)} />
        </div>

        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          <Menu mode="vertical" items={items} onClick={onMenuClick} />
        </Drawer>
      </Header>

      <Layout>
        {/* Optional: add Sider for desktop if needed */}
        {/* <Sider width={200} className="layout-sider">Sidebar</Sider> */}

        <Content className="layout-content">
          <Outlet /> 
        </Content>
      </Layout>
    </div>
  );
};

export default MainLayout;
