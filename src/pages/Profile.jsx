import React, { useState } from 'react';
import { Row, Col, Card, Avatar, Typography, Form, Input, Button, Tabs, Upload } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StyledCard = styled(Card)`
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
  }
`;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Here you would typically make an API call to update the user profile
    console.log('Profile update values:', values);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const items = [
    {
      key: '1',
      label: 'Personal Information',
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
          }}
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
        <Form layout="vertical">
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
              <Button type="primary" loading={loading}>
                Change Password
              </Button>
            </Col>
          </Row>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <StyledCard>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar size={100} icon={<UserOutlined />} />
              <Title level={3} style={{ marginTop: '16px', marginBottom: '8px' }}>
                John Doe
              </Title>
              <Text type="secondary">john.doe@example.com</Text>
            </div>
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="/api/upload" // Replace with your upload endpoint
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Change Avatar</div>
              </div>
            </Upload>
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