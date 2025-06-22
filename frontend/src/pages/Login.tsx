import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HeartFilled } from '@ant-design/icons';
import { userApi } from '../api/services';
import './Login.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm extends LoginForm {
  email: string;
  phone: string;
  confirmPassword: string;
}

// 模拟本地用户存储
const LOCAL_STORAGE_USERS_KEY = 'heart_health_users';

interface LocalUser {
  username: string;
  password: string;
  userId: number;
  email?: string;
  phone?: string;
}

// 获取本地存储的用户
const getLocalUsers = (): LocalUser[] => {
  const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// 保存用户到本地存储
const saveLocalUser = (user: LocalUser) => {
  const users = getLocalUsers();
  // 检查用户是否已存在
  const existingIndex = users.findIndex(u => u.username === user.username);

  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
};

// 验证本地用户登录
const validateLocalUser = (username: string, password: string): LocalUser | null => {
  const users = getLocalUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginForm) => {
    setLoginError(null);
    setLoading(true);

    try {
      let success = false;

      // 优先尝试后端
      try {
        const response = await userApi.login(values);
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('currentUser', response.data.username);
          localStorage.setItem('userId', response.data.userId.toString());
          success = true;
        } else if (response.data && response.data.msg) {
          setLoginError(response.data.msg || '用户名或密码错误');
          loginForm.setFields([
            {
              name: 'password',
              errors: ['密码错误，请重新输入']
            }
          ]);
        }
      } catch (e) {
        // 后端不可用，尝试本地验证
        const localUser = validateLocalUser(values.username, values.password);

        if (localUser) {
          localStorage.setItem('token', 'mock_token');
          localStorage.setItem('currentUser', localUser.username);
          localStorage.setItem('userId', localUser.userId.toString());
          success = true;
        } else {
          // 检查用户名是否存在
          const users = getLocalUsers();
          const userExists = users.some(u => u.username === values.username);

          if (userExists) {
            setLoginError('密码错误，请重新输入');
            loginForm.setFields([
              {
                name: 'password',
                errors: ['密码错误，请重新输入']
              }
            ]);
          } else {
            setLoginError('用户不存在，请先注册');
            loginForm.setFields([
              {
                name: 'username',
                errors: ['用户不存在，请先注册']
              }
            ]);
          }
        }
      }

      if (success) {
        message.success('登录成功');
        window.location.hash = '#/';
      }
    } catch (error) {
      setLoginError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    setRegistrationError(null);
    setLoading(true);

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

          // 即使后端注册成功，也保存到本地以便在后端不可用时能登录
          saveLocalUser({
            username: values.username,
            password: values.password,
            userId: response.data.userId || Date.now(),
            email: values.email,
            phone: values.phone
          });
        } else if (response.data && response.data.msg) {
          setRegistrationError(response.data.msg);
        }
      } catch (e) {
        // 后端不可用，保存到本地
        const users = getLocalUsers();
        const exists = users.some(user => user.username === values.username);

        if (exists) {
          setRegistrationError('用户名已存在');
          registerForm.setFields([
            {
              name: 'username',
              errors: ['用户名已存在，请更换用户名']
            }
          ]);
          setLoading(false);
          return;
        }

        saveLocalUser({
          username: values.username,
          password: values.password,
          userId: Date.now(),
          email: values.email,
          phone: values.phone
        });

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
      setRegistrationError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <HeartFilled className="logo-icon" />
          <Title level={2} className="login-title">心脏健康管理平台</Title>
          <Text className="login-subtitle">专业的心脏健康监测与管理系统</Text>
        </div>

        <Card className="login-card">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setLoginError(null);
              setRegistrationError(null);
              loginForm.resetFields();
              registerForm.resetFields();
            }}
            centered
            className="custom-tabs"
          >
            <TabPane tab="登录" key="login">
              {loginError && (
                <Alert
                  message={loginError}
                  type="error"
                  showIcon
                  closable
                  className="form-alert"
                  onClose={() => setLoginError(null)}
                />
              )}
              <Form
                form={loginForm}
                name="login"
                onFinish={handleLogin}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined className="input-icon" />} placeholder="用户名" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="密码" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block className="login-button" loading={loading}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="注册" key="register">
              {registrationError && (
                <Alert
                  message={registrationError}
                  type="error"
                  showIcon
                  closable
                  className="form-alert"
                  onClose={() => setRegistrationError(null)}
                />
              )}
              <Form
                form={registerForm}
                name="register"
                onFinish={handleRegister}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input prefix={<UserOutlined className="input-icon" />} placeholder="用户名" />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input prefix={<MailOutlined className="input-icon" />} placeholder="邮箱" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[
                    { required: true, message: '请输入手机号' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                  ]}
                >
                  <Input prefix={<PhoneOutlined className="input-icon" />} placeholder="手机号" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度不能小于6位' }
                  ]}
                >
                  <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="密码" />
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
                  <Input.Password prefix={<LockOutlined className="input-icon" />} placeholder="确认密码" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block className="login-button" loading={loading}>
                    注册
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>

        <Text className="login-footer">Copyright © 2025 心脏健康管理平台</Text>
      </div>
    </div>
  );
};

export default Login;