import React, { useState, useRef, useEffect } from 'react';
import { Card, List, Avatar, Input, Button, Empty, Dropdown, Menu, message } from 'antd';
import { UserOutlined, RobotOutlined, DownOutlined } from '@ant-design/icons';
import './Consultation.css';

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
}

const Consultation: React.FC<{ consultType?: string; onConsultTypeChange?: (type: string) => void }> = ({ consultType = 'doctor', onConsultTypeChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化消息
    if (consultType === 'doctor') {
      setMessages([
        { id: 1, sender: '医生', content: '您好，请问哪里不舒服？', time: new Date().toLocaleTimeString() }
      ]);
    } else {
      setMessages([
        { id: 1, sender: 'ChatGPT', content: '您好，我是智能健康助手，有什么可以帮您？', time: new Date().toLocaleTimeString() }
      ]);
    }
  }, [consultType]);

  useEffect(() => {
    // 滚动到底部
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) {
      message.warning('请输入消息内容');
      return;
    }

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      message.error('请先登录');
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: messages.length + 1,
      sender: '患者',
      content: inputValue,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // 这里可以添加发送消息到后端的逻辑
      // const response = await consultationApi.sendMessage({
      //   userId,
      //   content: inputValue,
      //   type: consultType
      // });

      // 模拟回复
      setTimeout(() => {
        const replyMessage: Message = {
          id: messages.length + 2,
          sender: consultType === 'doctor' ? '医生' : 'ChatGPT',
          content: consultType === 'doctor'
            ? '我明白了，请详细描述一下您的症状。'
            : '根据您的描述，我建议您注意以下几点：\n1. 保持规律作息\n2. 适当运动\n3. 保持心情愉悦',
          time: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, replyMessage]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('发送消息失败，请重试');
      setLoading(false);
    }
  };

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
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={item.sender === 'ChatGPT' ? <RobotOutlined /> : <UserOutlined />} />}
                title={<span>{item.sender} <span style={{ color: '#aaa', fontSize: 12 }}>{item.time}</span></span>}
                description={item.content}
              />
            </List.Item>
          )}
          locale={{ emptyText: <Empty description="暂无对话" /> }}
        />
        <div ref={messagesEndRef} />
        <div className="consultation-input">
          <Input.TextArea
            rows={2}
            placeholder="请输入消息..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={e => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            type="primary"
            style={{ marginTop: 8 }}
            onClick={handleSend}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Consultation; 