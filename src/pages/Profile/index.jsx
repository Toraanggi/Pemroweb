import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Typography, Form, Input, Button, Tabs, Upload, message, notification } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StyledCard = styled(Card)`
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const Profile = () => {
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phone: '',
  });

  // Ambil data dari localStorage saat pertama kali render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserData(storedUser);
      form.setFieldsValue({
        name: storedUser.fullname,
        email: storedUser.email,
        phone: storedUser.phone,
      });
    }
  }, [form]);

  const onUpdateProfile = (values) => {
    setLoading(true);
    const updatedUser = {
      ...userData,
      fullname: values.name,
      email: values.email,
      phone: values.phone,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    notification.success({
      message: 'Success',
      description: 'Your profile has been updated successfully!',
    });
    setLoading(false);
  };

  const onPasswordChange = (values) => {
    console.log("Password changed:", values);
    notification.success({
      message: 'Success',
      description: 'Your password has been updated successfully!',
    });
    securityForm.resetFields();
  };

  const items = [
    {
      key: '1',
      label: 'Personal Information',
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onUpdateProfile}
        >
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter your email" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Profile
              </Button>
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Security',
      children: (
        <Form layout="vertical" form={securityForm} onFinish={onPasswordChange}>
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter current password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, message: 'Please input your new password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button type="primary" onClick={onPasswordChange} loading={loading}>
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ maxWidth:2000, margin: '24px auto' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <StyledCard>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                {userData.fullname}
              </Title>
              <Text type="secondary">{userData.email}</Text>
            </div>
          </StyledCard>
        </Col>
        <Col span={24}>
          <StyledCard>
            <Tabs defaultActiveKey="1" items={items} />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
