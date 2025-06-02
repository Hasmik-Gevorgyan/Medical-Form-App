import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MainHeader from '@/components/Header';
import AIChatModal from '@/ai/AIComponent';
import './layout.css'

const {Content } = Layout;

const MainLayout: React.FC = () => {
	return (
	  <Layout>
		<MainHeader />
		<div className="main-body"> {/* Flex container */}
		  <div className="chat-sidebar">
			<AIChatModal />
		  </div>
		  <Content className="layout-content">
			<Outlet />
		  </Content>
		</div>
	  </Layout>
	);
};

export default MainLayout;
