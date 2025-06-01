import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MainHeader from '@/components/Header';

const {Content } = Layout;

const MainLayout: React.FC = () => {

  return (
      <Layout>
        <MainHeader />

        <Content className="layout-content">
          <Outlet /> 
        </Content>
      </Layout>
  );
};

export default MainLayout;
