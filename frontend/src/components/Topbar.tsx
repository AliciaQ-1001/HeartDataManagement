import React, { useState } from 'react';
import { Input, Avatar, Badge, Dropdown, Menu, Button } from 'antd';
import { BellOutlined, SearchOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC<{ onConsultTypeChange?: (type: string) => void }> = ({ onConsultTypeChange }) => {
  const navigate = useNavigate();
  const [consultType, setConsultType] = useState('doctor');
  const handleMenuClick = (e: any) => {
    setConsultType(e.key);
    onConsultTypeChange?.(e.key);
  };
  // const menu = (
  //   <Menu onClick={handleMenuClick} selectedKeys={[consultType]}>
  //     <Menu.Item key="doctor">与医生咨询</Menu.Item>
  //     <Menu.Item key="chatgpt">与ChatGPT咨询</Menu.Item>
  //   </Menu>
  // );
  return (
    <div className="topbar">
      <div className="greeting">您好！ <b>Alicia Qiu</b></div>
      <div className="topbar-actions">
        <Input className="search-input" placeholder="搜索..." prefix={<SearchOutlined />} />
        <Badge count={2} offset={[0, 0]}>
          <BellOutlined className="topbar-icon" />
        </Badge>
        {/* <Dropdown overlay={menu} placement="bottomRight">
          <Button className="consult-type-btn">
            {consultType === 'doctor' ? '与医生咨询' : '与ChatGPT咨询'} <DownOutlined />
          </Button>
        </Dropdown> */}
        <Avatar icon={<UserOutlined />} onClick={() => navigate('/user')} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
};

export default Topbar; 