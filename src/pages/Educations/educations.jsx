import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Popconfirm,
  notification,
  Input,
  FloatButton,
  Form,
  List,
  Spin,
  Drawer
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getData, sendData, deleteData } from "../../utils/api";

const { Title, Text } = Typography;

const Educations = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  useEffect(() => {
    const filtered = playlistData.filter(item =>
      item.play_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.play_description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, playlistData]);

  const fetchPlaylistData = () => {
    setLoading(true);
    getData("/api/playlist/45")
      .then((response) => {
        if (response && Array.isArray(response.datas)) {
        const educationData = response.datas.filter(
          (item) => item.play_genre === "education"
        );
          setPlaylistData(educationData);
          setFilteredData(educationData);
        } else {
          showAlert("error", "Error", "No data available");
          setPlaylistData([]);
        }
      })
      .catch(() => {
        showAlert("error", "Error", "Failed to load playlist data");
      })
      .finally(() => setLoading(false));
  };

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleDelete = (id) => {
    deleteData(`/api/playlist/${id}`)
      .then((response) => {
        if (response.status === 404) {
          showAlert("error", "Failed", "Playlist not found");
        } else {
          showAlert("success", "Success", "Playlist deleted successfully");
          fetchPlaylistData();
        }
      })
      .catch((error) => {
        showAlert("error", "Failed", "An error occurred while deleting the data");
        console.error(error);
      });
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("play_name", values.title);
        formData.append("play_genre", "education");
        formData.append("play_url", values.url);
        formData.append("play_description", values.description);
        formData.append("play_thumbnail", values.thumbnail);

        const url = editMode ? `/api/playlist/update/${currentId}` : "/api/playlist/45";
        const request = sendData(url, formData);

        request
          .then((res) => {
            if (res?.datas) {
              showAlert(
                "success",
                editMode ? "Updated" : "Added",
                `Playlist ${editMode ? 'updated' : 'added'} successfully`
              );
              setOpenDrawer(false);
              fetchPlaylistData();
            }
          })
          .catch((err) => {
            console.error(err);
            showAlert("error", "Error", "Failed to submit data");
          })
          .finally(() => setSubmitting(false));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleEdit = (item) => {
    form.setFieldsValue({
      title: item.play_name,
      url: item.play_url,
      description: item.play_description,
      thumbnail: item.play_thumbnail
    });
    setCurrentId(item.id_play);
    setEditMode(true);
    setOpenDrawer(true);
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">
            <FloatButton
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => {
                form.resetFields();
                setEditMode(false);
                setOpenDrawer(true);
              }}
            />

            <Drawer
              title={editMode ? "Edit Playlist" : "Tambah Playlist"}
              width={500}
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              footer={
                <div style={{ textAlign: 'right' }}>
                  <Button onClick={() => setOpenDrawer(false)} style={{ marginRight: 8 }}>
                    Batal
                  </Button>
                  <Button 
                    type="primary"
                    onClick={handleSubmit}
                    loading={submitting}
                  >
                    {editMode ? "Update" : "Simpan"}
                  </Button>
                </div>
              }
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="title"
                  label="Judul Video"
                  rules={[{ required: true, message: 'Judul harus diisi' }]}
                >
                  <Input placeholder="Contoh: Tutorial React Dasar" />
                </Form.Item>

                <Form.Item
                  name="url"
                  label="URL YouTube"
                  rules={[
                    { required: true, message: 'URL harus diisi' }  ,
                    { 
                      pattern: /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
                      message: 'URL YouTube tidak valid' 
                    }
                  ]}
                >
                  <Input placeholder="https://youtube.com/watch?v=..." />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Deskripsi"
                  rules={[{ required: true, message: 'Deskripsi harus diisi' }]}
                >
                  <Input.TextArea rows={4} placeholder="Deskripsi video" />
                </Form.Item>

                <Form.Item
                  name="thumbnail"
                  label="Thumbnail URL"
                  rules={[
                    { 
                      required: true, 
                      message: 'Thumbnail wajib diisi' 
                    },
                    { 
                      type: 'url', 
                      message: 'URL tidak valid' 
                    }
                  ]}
                >
                  <Input placeholder="Masukkan URL thumbnail" />
                </Form.Item>
              </Form>
            </Drawer>

            <Title level={2}>Playlist Edukasi</Title>
            <Text style={{ fontSize: "12pt" }}>Daftar video pembelajaran</Text>

            <Input
              prefix={<SearchOutlined />}
              placeholder="Cari video..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              className="header-search"
              size="large"
              style={{ marginBottom: 24 }}
            />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin tip="Memuat data..." size="large" />
              </div>
            ) : filteredData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Text type="secondary">
                  {searchText ? 'Tidak ditemukan hasil pencarian' : 'Belum ada data playlist'}
                </Text>
              </div>
            ) : (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 3,
                  xl: 3,
                }}
                dataSource={filteredData}
                renderItem={item => (
                  <List.Item key={item.id_play}>
                    <Card
                      hoverable
                      cover={
                        <a href={item.play_url} target="_blank" rel="noopener noreferrer">
                          <img
                            alt="thumbnail"
                            src={item.play_thumbnail || 'https://via.placeholder.com/300x200?text=No+Thumbnail'}
                            style={{ 
                              height: '200px', 
                              objectFit: 'fill',
                              borderTopRightRadius: '10px',
                              borderTopLeftRadius: '10px',
                              width: '100%'
                            }}
                          />
                        </a>
                      }
                      actions={[
                        <EditOutlined 
                          key="edit" 
                          onClick={() => handleEdit(item)} 
                        />,
                        <Popconfirm
                          title="Hapus playlist ini?"
                          onConfirm={() => handleDelete(item.id_play)}
                          okText="Ya"
                          cancelText="Tidak"
                        >
                          <DeleteOutlined key="delete" />
                        </Popconfirm>
                      ]}
                    >
                      <Card.Meta
                        title={<Text strong ellipsis>{item.play_name || 'No Title'}</Text>}
                        description={
                          <Text ellipsis>
                            {item.play_description || 'No description available'}
                          </Text>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Educations;