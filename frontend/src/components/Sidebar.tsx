import React from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  HeartOutlined,
  CloudOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname === '/' ? 'dashboard' : location.pathname.replace('/', '');

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'dashboard') {
      navigate('/');
    } else if (key === 'user') {
      navigate('/user');
    } else {
      navigate('/' + key);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">心脏健康<br />管理系统</div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
      >
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>首页</Menu.Item>
        <Menu.Item key="heart" icon={<HeartOutlined />}>心脏</Menu.Item>
        <Menu.Item key="respiratory" icon={<CloudOutlined />}>呼吸</Menu.Item>
        <Menu.Item key="sleep" icon={<CloudOutlined />}>睡眠</Menu.Item>
        <Menu.Item key="consultation" icon={<MessageOutlined />}>咨询</Menu.Item>
        {/* <Menu.Item key="user" icon={<UserOutlined />}>个人信息</Menu.Item> */}
      </Menu>
    </div>
  );
};

export default Sidebar; 