import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { userApi } from '../api/services';
import './UserInfo.css';

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

const UserInfo: React.FC = () => {
  const [info, setInfo] = useState<UserInfo>({
    userId: 0,
    userName: '',
    userGender: null,
    userAge: null,
    userPhone: null,
    userAddress: null,
    userEmail: null,
    userIdCard: null,
    userEmergency: null,
    userAllergy: null,
    userHistory: null
  });
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        message.error('请先登录');
        return;
      }
      const response = await userApi.getUserInfo(userId);
      const data = response.data as ApiResponse<UserInfo>;
      if (data.code === 20000) {
        setInfo(data.data);
      } else {
        message.error(data.msg || '获取用户信息失败');
      }
    } catch (error) {
      message.error('获取用户信息失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue({
      userName: info.userName,
      userGender: info.userGender,
      userAge: info.userAge,
      userPhone: info.userPhone,
      userEmail: info.userEmail,
      userIdCard: info.userIdCard,
      userAddress: info.userAddress,
      userEmergency: info.userEmergency,
      userAllergy: info.userAllergy,
      userHistory: info.userHistory
    });
    setEditVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        message.error('请先登录');
        return;
      }
      const response = await userApi.updateUserInfo({
        ...values,
        userId
      });
      const data = response.data as ApiResponse<null>;
      if (data.code === 20000) {
        message.success('信息已更新');
        setEditVisible(false);
        fetchUserInfo(); // 重新获取用户信息
      } else {
        message.error(data.msg || '更新失败');
      }
    } catch (error) {
      message.error('更新失败，请检查网络连接');
    }
  };

  return (
    <div className="userinfo-container">
      <Card title="用户信息" className="userinfo-card" loading={loading} extra={<Button onClick={handleEdit}>编辑</Button>}>
        <div className="userinfo-header">
          <Avatar size={64} icon={<UserOutlined />} />
          <span className="userinfo-name">{info.userName || '未设置'}</span>
        </div>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="性别">{info.userGender || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="年龄">{info.userAge || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{info.userPhone || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{info.userEmail || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{info.userIdCard || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="住址">{info.userAddress || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="紧急联系人">{info.userEmergency || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="过敏史">{info.userAllergy || '无'}</Descriptions.Item>
          <Descriptions.Item label="既往病史">{info.userHistory || '无'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal title="编辑用户信息" open={editVisible} onOk={handleSave} onCancel={() => setEditVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="userName" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
          <Form.Item label="性别" name="userGender" rules={[{ required: true, message: '请输入性别' }]}><Input /></Form.Item>
          <Form.Item label="年龄" name="userAge" rules={[{ required: true, message: '请输入年龄' }]}><Input /></Form.Item>
          <Form.Item label="联系方式" name="userPhone" rules={[{ required: true, message: '请输入联系方式' }]}><Input /></Form.Item>
          <Form.Item label="邮箱" name="userEmail"><Input /></Form.Item>
          <Form.Item label="身份证号" name="userIdCard"><Input /></Form.Item>
          <Form.Item label="住址" name="userAddress"><Input /></Form.Item>
          <Form.Item label="紧急联系人" name="userEmergency"><Input /></Form.Item>
          <Form.Item label="过敏史" name="userAllergy"><Input /></Form.Item>
          <Form.Item label="既往病史" name="userHistory"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo; 