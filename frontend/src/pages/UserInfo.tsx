import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserInfo.css';

const defaultInfo = {
  name: 'Kate Tanner',
  gender: '女',
  age: '36',
  phone: '123-4567-8901',
  address: '上海市徐汇区XX路88号',
  email: 'kate.tanner@email.com',
  id: '310101198701010123',
  emergency: '王先生 138-8888-8888',
  allergy: '无',
  history: '无',
};

const UserInfo: React.FC = () => {
  const [info, setInfo] = useState(defaultInfo);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue(info);
    setEditVisible(true);
  };
  const handleSave = () => {
    form.validateFields().then(values => {
      setInfo(values);
      setEditVisible(false);
      message.success('信息已更新');
    });
  };

  return (
    <div className="userinfo-container">
      <Card title="用户信息" className="userinfo-card" extra={<Button onClick={handleEdit}>编辑</Button>}>
        <div className="userinfo-header">
          <Avatar size={64} icon={<UserOutlined />} />
          <span className="userinfo-name">{info.name}</span>
        </div>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="性别">{info.gender}</Descriptions.Item>
          <Descriptions.Item label="年龄">{info.age}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{info.phone}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{info.email}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{info.id}</Descriptions.Item>
          <Descriptions.Item label="住址">{info.address}</Descriptions.Item>
          <Descriptions.Item label="紧急联系人">{info.emergency}</Descriptions.Item>
          <Descriptions.Item label="过敏史">{info.allergy}</Descriptions.Item>
          <Descriptions.Item label="既往病史">{info.history}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Modal title="编辑用户信息" open={editVisible} onOk={handleSave} onCancel={() => setEditVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
          <Form.Item label="性别" name="gender" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="年龄" name="age" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="联系方式" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="邮箱" name="email"><Input /></Form.Item>
          <Form.Item label="身份证号" name="id"><Input /></Form.Item>
          <Form.Item label="住址" name="address"><Input /></Form.Item>
          <Form.Item label="紧急联系人" name="emergency"><Input /></Form.Item>
          <Form.Item label="过敏史" name="allergy"><Input /></Form.Item>
          <Form.Item label="既往病史" name="history"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo; 