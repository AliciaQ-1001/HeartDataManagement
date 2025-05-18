import React from 'react';
import { Card, List, Avatar, Input, Button, Empty, Dropdown, Menu } from 'antd';
import { UserOutlined, RobotOutlined, DownOutlined } from '@ant-design/icons';
import './Consultation.css';

const messages = [
  { id: 1, sender: '医生', content: '您好，请问哪里不舒服？', time: '09:00' },
  { id: 2, sender: '患者', content: '最近有点胸闷。', time: '09:01' },
];

const chatgptMessages = [
  { id: 1, sender: 'ChatGPT', content: '您好，我是智能健康助手，有什么可以帮您？', time: '09:00' },
];

const Consultation: React.FC<{ consultType?: string; onConsultTypeChange?: (type: string) => void }> = ({ consultType = 'doctor', onConsultTypeChange }) => {
  const menu = (
    <Menu onClick={({ key }) => onConsultTypeChange?.(key)} selectedKeys={[consultType]}>
      <Menu.Item key="doctor">与医生咨询</Menu.Item>
      <Menu.Item key="chatgpt">与ChatGPT咨询</Menu.Item>
    </Menu>
  );
  return (
    <div className="consultation-container">
      <Card
        title={consultType === 'doctor' ? '医生问诊' : 'ChatGPT健康助手'}
        className="consultation-card"
        extra={
          <Dropdown overlay={menu} placement="bottomRight">
            <Button className="consult-type-btn">
              {consultType === 'doctor' ? '与医生咨询' : '与ChatGPT咨询'} <DownOutlined />
            </Button>
          </Dropdown>
        }
      >
        {consultType === 'doctor' ? (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<span>{item.sender} <span style={{ color: '#aaa', fontSize: 12 }}>{item.time}</span></span>}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={chatgptMessages}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<RobotOutlined />} />}
                  title={<span>{item.sender} <span style={{ color: '#aaa', fontSize: 12 }}>{item.time}</span></span>}
                  description={item.content}
                />
              </List.Item>
            )}
            locale={{ emptyText: <Empty description="暂无对话" /> }}
          />
        )}
        <div className="consultation-input">
          <Input.TextArea rows={2} placeholder="请输入消息..." />
          <Button type="primary" style={{ marginTop: 8 }}>发送</Button>
        </div>
      </Card>
    </div>
  );
};

export default Consultation; 