import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  notification,
  Form,
  Input,
  Select,
  Slider,
  Statistic,
  Divider,
  theme,
  Space,
} from 'antd';
import { CreditCardOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

// Harga berbeda untuk tiap jumlah bulan
const customPrices = {
  1: 150000,
  2: 295000,
  3: 435000,
  6: 840000,   // diskon sedikit
  12: 1550000, // diskon lebih besar
  24: 2900000, // diskon maksimal
};

const Subscription = () => {
  const [duration, setDuration] = useState(1);
  const [totalPrice, setTotalPrice] = useState(customPrices[1]);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();
  const [notificationApi, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();

  useEffect(() => {
    if (customPrices[duration]) {
      setTotalPrice(customPrices[duration]);
    } else {
      // Harga default = 150000 per bulan jika tidak termasuk dalam daftar khusus
      setTotalPrice(duration * 150000);
    }
  }, [duration]);

  const handleSubscribe = (values) => {
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      notificationApi.success({
        message: 'Pembayaran Berhasil!',
        description: (
          <div>
            Terima kasih, <strong>{values.fullName}</strong>!<br />
            Anda telah berlangganan selama <strong>{duration} bulan</strong>.<br />
            Total pembayaran: <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong>.<br />
            🎉 Fitur: Limit playlist Anda telah ditingkatkan!
          </div>
        ),
        icon: <CheckCircleFilled style={{ color: '#52c41a' }} />,
        duration: 6,
      });
      form.resetFields();
      setDuration(1);
    }, 2000);
  };

  return (
    <div style={{ maxWidth:2000, margin: '24px auto' }}>
      {contextHolder}
      <Card style={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={14}>
            <Title level={3}>Formulir Berlangganan</Title>
            <Paragraph type="secondary">
              Isi data Anda dan pilih durasi untuk mendapatkan akses Pro.
            </Paragraph>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubscribe}
              initialValues={{ duration: 1 }}
            >
              <Form.Item
                name="fullName"
                label="Nama Lengkap"
                rules={[{ required: true, message: 'Masukkan nama lengkap Anda' }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Alamat Email"
                rules={[{ required: true, type: 'email', message: 'Email tidak valid' }]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>

              <Form.Item label="Durasi Langganan (Bulan)">
                <Row align="middle">
                  <Col span={16}>
                    <Slider
                      min={1}
                      max={24}
                      onChange={setDuration}
                      value={duration}
                      marks={{ 1: '1', 3: '3', 6: '6', 12: '12', 24: '24' }}
                    />
                  </Col>
                  <Col span={4} offset={1}>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value) || 1)}
                      style={{ textAlign: 'center' }}
                    />
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Metode Pembayaran"
                rules={[{ required: true, message: 'Pilih metode pembayaran' }]}
              >
                <Select placeholder="Pilih metode pembayaran">
                  <Option value="credit_card">Kartu Kredit</Option>
                  <Option value="bank_transfer">Transfer Bank</Option>
                  <Option value="gopay">GoPay</Option>
                  <Option value="ovo">OVO</Option>
                </Select>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} md={10}>
            <div style={{
              backgroundColor: '#f5f5f5',
              padding: '24px',
              borderRadius: token.borderRadiusLG,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Title level={4}>Rincian Pesanan</Title>
              <Space direction="vertical">
                <Text>Durasi: <strong>{duration} bulan</strong></Text>
                <Text>Total Harga: <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong></Text>
                <Text>Benefit:</Text>
                <ul style={{ paddingLeft: '20px' }}>
                  <li>Akses fitur Pro</li>
                  <li>Limit playlist ditingkatkan</li>
                </ul>
              </Space>
              <Divider />
              <div style={{ marginTop: 'auto' }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CreditCardOutlined />}
                  onClick={() => form.submit()}
                  loading={submitting}
                >
                  {submitting ? 'Memproses...' : 'Bayar Sekarang'}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Subscription;