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

const Dashboard = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [genreFilter, setGenreFilter] = useState("all");

  // Gabungkan filter genre dan search
  const filteredData = playlistData.filter(item => {
    const genre = (item.play_genre || "").toLowerCase();
    const matchGenre = genreFilter === "all" || genre === genreFilter.toLowerCase();
    const matchSearch =
      (item.play_name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.play_description || "").toLowerCase().includes(searchText.toLowerCase());
    return matchGenre && matchSearch;
  });

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = () => {
    setLoading(true);
    getData("/api/playlist/45")
      .then((response) => {
        if (response && Array.isArray(response.datas)) {
          console.log("Genre pada data:", response.datas.map(d => d.play_genre));
          setPlaylistData(response.datas);
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
        formData.append("play_genre", "");
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
<div style={{ margin: "16px 0", textAlign: "right" }}>
              <Button.Group>
                <Button
                  type={genreFilter === "all" ? "primary" : "default"}
                  style={{
                    borderRadius: "20px 0 0 20px",
                    fontWeight: "bold",
                    background: genreFilter === "all" ? "#1890ff" : "#fff",
                    color: genreFilter === "all" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("all")}
                >
                  All
                </Button>
                <Button
                  type={genreFilter === "song" ? "primary" : "default"}
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    background: genreFilter === "song" ? "#1890ff" : "#fff",
                    color: genreFilter === "song" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("song")}
                >
                  Song
                </Button>
                <Button
                  type={genreFilter === "music" ? "primary" : "default"}
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    background: genreFilter === "music" ? "#1890ff" : "#fff",
                    color: genreFilter === "music" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("music")}
                >
                  Music
                </Button>
                <Button
                  type={genreFilter === "education" ? "primary" : "default"}
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    background: genreFilter === "education" ? "#1890ff" : "#fff",
                    color: genreFilter === "education" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("education")}
                >
                  Educations
                </Button>
                <Button
                  type={genreFilter === "movie" ? "primary" : "default"}
                  style={{
                    borderRadius: 0,
                    fontWeight: "bold",
                    background: genreFilter === "movie" ? "#1890ff" : "#fff",
                    color: genreFilter === "movie" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("movie")}
                >
                  Movie
                </Button>
                <Button
                  type={genreFilter === "others" ? "primary" : "default"}
                  style={{
                    borderRadius: "0 20px 20px 0",
                    fontWeight: "bold",
                    background: genreFilter === "others" ? "#1890ff" : "#fff",
                    color: genreFilter === "others" ? "#fff" : "#1890ff",
                    borderColor: "#1890ff"
                  }}
                  onClick={() => setGenreFilter("others")}
                >
                  Others
                </Button>
              </Button.Group>
            </div>
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
                        <a href ={item.play_url} target="_blank" rel="noopener noreferrer">
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

export default Dashboard;