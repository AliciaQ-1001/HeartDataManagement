import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Avatar, Button, Modal, Form, Input, message, Row, Col, Tabs, Divider, Tag, Select, Result } from 'antd';
import { UserOutlined, EditOutlined, PhoneOutlined, MailOutlined, HomeOutlined, HeartOutlined, TeamOutlined, IdcardOutlined, MedicineBoxOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { userApi } from '../api/services';
import './UserInfo.css';

const { TabPane } = Tabs;
const { Option } = Select;

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
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [showSuccess, setShowSuccess] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        message.error('请先登录');
        return;
      }

      // 首先尝试从localStorage获取缓存的用户信息
      const cachedUserInfo = localStorage.getItem(`userInfo_${userId}`);
      if (cachedUserInfo) {
        const parsedInfo = JSON.parse(cachedUserInfo) as UserInfo;
        setInfo(parsedInfo);
      }

      // 然后尝试从服务器获取最新信息
      try {
        const response = await userApi.getUserInfo(userId);
        const data = response.data as ApiResponse<UserInfo>;
        if (data.code === 20000) {
          setInfo(data.data);
          // 更新本地缓存
          localStorage.setItem(`userInfo_${userId}`, JSON.stringify(data.data));
        } else if (!cachedUserInfo) {
          // 只有在没有缓存的情况下才显示错误
          message.error(data.msg || '获取用户信息失败');
        }
      } catch (error) {
        if (!cachedUserInfo) {
          // 只有在没有缓存的情况下才显示错误
          message.error('获取用户信息失败，使用本地缓存数据');
        }
      }
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
      setSaveLoading(true);
      const values = await form.validateFields();
      const userId = Number(localStorage.getItem('userId'));
      if (!userId) {
        message.error('请先登录');
        setSaveLoading(false);
        return;
      }

      // 本地更新用户信息
      const updatedInfo = {
        ...info,
        ...values
      };

      // 更新本地存储
      localStorage.setItem(`userInfo_${userId}`, JSON.stringify(updatedInfo));

      try {
        // 尝试调用后端接口
        const response = await userApi.updateUserInfo({
          ...values,
          userId
        });
        const data = response.data as ApiResponse<null>;
        if (data.code === 20000) {
          // 显示成功动画
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
          }, 2000);
        } else {
          message.warning('后端更新失败，但已在本地更新');
        }
      } catch (error) {
        // 后端请求失败，但仍在本地更新
        message.warning('无法连接到服务器，仅在本地更新');
      }

      // 无论后端是否成功，都更新本地状态
      setInfo(updatedInfo);
      setEditVisible(false);

    } catch (error) {
      message.error('表单验证失败，请检查输入');
    } finally {
      setSaveLoading(false);
    }
  };

  // 获取头像的首字母
  const getAvatarText = () => {
    if (!info.userName) return '?';
    return info.userName.charAt(0).toUpperCase();
  };

  const renderBasicInfo = () => {
    return (
      <div className="info-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={8}>
            <div className="info-item">
              <UserOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">姓名</div>
                <div className="info-value">{info.userName || '未设置'}</div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="info-item">
              <IdcardOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">性别</div>
                <div className="info-value">{info.userGender || '未设置'}</div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="info-item">
              <TeamOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">年龄</div>
                <div className="info-value">{info.userAge || '未设置'}</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderContactInfo = () => {
    return (
      <div className="info-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <div className="info-item">
              <PhoneOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">联系方式</div>
                <div className="info-value">{info.userPhone || '未设置'}</div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div className="info-item">
              <MailOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">邮箱</div>
                <div className="info-value">{info.userEmail || '未设置'}</div>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="info-item">
              <HomeOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">住址</div>
                <div className="info-value">{info.userAddress || '未设置'}</div>
              </div>
            </div>
          </Col>
          <Col xs={24}>
            <div className="info-item">
              <TeamOutlined className="info-icon" />
              <div className="info-content">
                <div className="info-label">紧急联系人</div>
                <div className="info-value">{info.userEmergency || '未设置'}</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderMedicalInfo = () => {
    const allergies = info.userAllergy ? info.userAllergy.split(',') : [];
    const histories = info.userHistory ? info.userHistory.split(',') : [];

    return (
      <div className="info-section">
        <div className="medical-info-block">
          <div className="medical-info-title">
            <HeartOutlined /> 过敏史
          </div>
          <div className="medical-info-content">
            {allergies.length > 0 ? (
              <div className="tag-container">
                {allergies.map((item, index) => (
                  <Tag key={index} color="red">{item.trim()}</Tag>
                ))}
              </div>
            ) : (
              <div className="empty-info">无过敏史</div>
            )}
          </div>
        </div>

        <div className="medical-info-block">
          <div className="medical-info-title">
            <MedicineBoxOutlined /> 既往病史
          </div>
          <div className="medical-info-content">
            {histories.length > 0 ? (
              <div className="tag-container">
                {histories.map((item, index) => (
                  <Tag key={index} color="blue">{item.trim()}</Tag>
                ))}
              </div>
            ) : (
              <div className="empty-info">无既往病史</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="userinfo-container">
      {showSuccess && (
        <div className="success-overlay">
          <Result
            status="success"
            title="保存成功！"
            subTitle="您的个人信息已成功更新"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          />
        </div>
      )}

      <Card
        className="userinfo-card"
        loading={loading}
        title={
          <div className="userinfo-title">
            <h2>个人资料</h2>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="edit-button"
            >
              编辑资料
            </Button>
          </div>
        }
      >
        <div className="userinfo-profile">
          <div className="userinfo-avatar-section">
            <Avatar size={80} className="user-avatar">
              {getAvatarText()}
            </Avatar>
            <div className="user-name">{info.userName || '未设置姓名'}</div>
            <div className="user-id">ID: {info.userId}</div>
          </div>

          <Divider />

          <Tabs activeKey={activeTab} onChange={setActiveTab} className="info-tabs">
            <TabPane tab="基本信息" key="1">
              {renderBasicInfo()}
            </TabPane>
            <TabPane tab="联系方式" key="2">
              {renderContactInfo()}
            </TabPane>
            <TabPane tab="健康信息" key="3">
              {renderMedicalInfo()}
            </TabPane>
          </Tabs>
        </div>
      </Card>

      <Modal
        title="编辑用户信息"
        open={editVisible}
        onOk={handleSave}
        onCancel={() => setEditVisible(false)}
        className="edit-modal"
        width={700}
        confirmLoading={saveLoading}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" className="userinfo-form">
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="姓名"
                name="userName"
                rules={[
                  { required: true, message: '请输入姓名' },
                  { max: 20, message: '姓名不能超过20个字符' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="性别"
                name="userGender"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择性别">
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                  <Option value="其他">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="年龄"
                name="userAge"
                rules={[
                  { required: true, message: '请输入年龄' },
                  { pattern: /^[0-9]+$/, message: '年龄必须为数字' },
                  { max: 3, message: '年龄格式不正确' }
                ]}
              >
                <Input type="number" placeholder="请输入年龄" min={0} max={150} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="联系方式"
                name="userPhone"
                rules={[
                  { required: true, message: '请输入联系方式' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="邮箱"
                name="userEmail"
                rules={[
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="身份证号"
            name="userIdCard"
            rules={[
              { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码' }
            ]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="请输入身份证号码" />
          </Form.Item>

          <Form.Item label="住址" name="userAddress">
            <Input prefix={<HomeOutlined />} placeholder="请输入住址" />
          </Form.Item>

          <Form.Item
            label="紧急联系人"
            name="userEmergency"
            extra="格式: 姓名-电话，如: 张三-13800138000"
          >
            <Input prefix={<TeamOutlined />} placeholder="请输入紧急联系人" />
          </Form.Item>

          <Form.Item label="过敏史" name="userAllergy" extra="多种过敏源请用逗号分隔">
            <Input.TextArea rows={2} placeholder="如: 青霉素,海鲜,花粉" />
          </Form.Item>

          <Form.Item label="既往病史" name="userHistory" extra="多种病史请用逗号分隔">
            <Input.TextArea rows={3} placeholder="如: 高血压,糖尿病,心脏病" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserInfo; 