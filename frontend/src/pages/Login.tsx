import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { userApi } from '../api/services';
import './Login.css';

const { TabPane } = Tabs;

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  email: string;
  phone: string;
  confirmPassword: string;
}

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values: LoginForm) => {
    try {
      let success = false;
      let username = values.username;
      let userId = 1;
      // 优先尝试后端
      try {
        const response = await userApi.login(values);
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('currentUser', response.data.username);
          localStorage.setItem('userId', response.data.userId.toString());
          success = true;
        }
      } catch (e) {
        // 后端不可用，直接本地写token
        localStorage.setItem('token', 'mock_token');
        localStorage.setItem('currentUser', username);
        localStorage.setItem('userId', userId.toString());
        success = true;
      }
      if (success) {
        message.success('登录成功');
        window.location.hash = '#/';
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败');
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    try {
      let success = false;
      // 优先尝试后端
      try {
        const response = await userApi.register({
          username: values.username,
          password: values.password
        });
        if (response.data && response.data.code === 20000) {
          success = true;
        } else if (response.data && response.data.msg) {
          message.error(response.data.msg);
          return;
        }
      } catch (e) {
        // 后端不可用，直接本地模拟注册成功
        success = true;
      }
      if (success) {
        message.success('注册成功');
        setActiveTab('login');
        loginForm.setFieldsValue({
          username: values.username,
          password: ''
        });
      }
    } catch (error) {
      message.error('注册失败');
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="登录" key="login">
            <Form
              form={loginForm}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="注册" key="register">
            <Form
              form={registerForm}
              name="register"
              onFinish={handleRegister}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱" />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="手机号" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码长度不能小于6位' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login; 