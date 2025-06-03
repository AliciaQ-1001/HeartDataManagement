import React, { useState, useEffect } from 'react';
import { Input, Avatar, Badge, Dropdown, Menu, Button, message, Popover, List } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/services';
import './Topbar.css';

interface UserInfo {
  userId: number;
  userName: string;
  userGender: string | null;
  userAge: string | null;
  userPhone: string | null;
  userAddress: string | null;
  userEmail: string | null;
  userIdCard: string | null;
  userEmergency: string | null;
  userAllergy: string | null;
  userHistory: string | null;
}

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

const Topbar: React.FC<{ onConsultTypeChange?: (type: string) => void }> = ({ onConsultTypeChange }) => {
  const navigate = useNavigate();
  const [consultType, setConsultType] = useState('doctor');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notices, setNotices] = useState([
    '2025-05-30 08:00 体温偏高（38.2°C）',
    '2025-05-30 14:00 心率异常（120次/分）'
  ]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        navigate('/login');
        return;
      }
      const response = await userApi.getUserInfo(userId);
      const data = response.data as ApiResponse<UserInfo>;
      if (data.code === 20000) {
        setUserInfo(data.data);
      } else {
        message.error(data.msg || '获取用户信息失败');
      }
    } catch (error) {
      message.error('获取用户信息失败，请检查网络连接');
    }
  };

  const handleMenuClick = (e: any) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userId');
      message.success('已退出登录');
      navigate('/login');
    } else if (e.key === 'edit') {
      navigate('/user');
    } else {
      setConsultType(e.key);
      onConsultTypeChange?.(e.key);
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit">编辑信息</Menu.Item>
      <Menu.Item key="logout">退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div className="topbar">
      <div className="greeting">
        您好！ <b>{userInfo?.userName || 'Alicia'}</b>
      </div>
      <div className="topbar-actions">
        <Input className="search-input" placeholder="搜索..." prefix={<SearchOutlined />} />
        <Popover
          placement="bottom"
          content={
            <List
              size="small"
              dataSource={notices}
              renderItem={item => <List.Item style={{ fontSize: 13 }}>{item}</List.Item>}
            />
          }
          trigger="hover"
        >
          <Badge count={notices.length} offset={[0, 0]}>
            <BellOutlined className="topbar-icon" onClick={() => setNotices([])} style={{ cursor: 'pointer' }} />
          </Badge>
        </Popover>
        <Dropdown overlay={userMenu} placement="bottomRight" trigger={["hover"]}>
          <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </div>
    </div>
  );
};

export default Topbar; 