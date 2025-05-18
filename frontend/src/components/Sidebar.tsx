import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  HeartOutlined,
  CloudOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname === '/' ? 'dashboard' : location.pathname.replace('/', '');
  return (
    <div className="sidebar">
      <div className="logo">心脏健康管理系统</div>
      <Menu mode="inline" selectedKeys={[selectedKey]} onClick={({ key }) => {
        if (key === 'dashboard') navigate('/');
        else navigate('/' + key);
      }}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>首页</Menu.Item>
        <Menu.Item key="heart" icon={<HeartOutlined />}>心脏</Menu.Item>
        <Menu.Item key="respiratory" icon={<CloudOutlined />}>呼吸</Menu.Item>
        <Menu.Item key="sleep" icon={<CloudOutlined />}>睡眠</Menu.Item>
        <Menu.Item key="consultation" icon={<MessageOutlined />}>咨询</Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar; 