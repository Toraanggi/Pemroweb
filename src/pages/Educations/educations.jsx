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
  // STATE MANAGEMENT
  const [playlistData, setPlaylistData] = useState([]); // Menyimpan data playlist dari API
  const [filteredData, setFilteredData] = useState([]); // Menyimpan data hasil filter/pencarian
  const [searchText, setSearchText] = useState(""); // Menyimpan teks pencarian
  const [loading, setLoading] = useState(false); // Status loading saat mengambil data
  const [submitting, setSubmitting] = useState(false); // Status loading saat submit form
  const [openDrawer, setOpenDrawer] = useState(false); // Mengontrol tampilan drawer
  const [editMode, setEditMode] = useState(false); // Mode edit atau tambah data
  const [currentId, setCurrentId] = useState(null); // ID playlist yang sedang diedit
  const [api, contextHolder] = notification.useNotification(); // Sistem notifikasi
  const [form] = Form.useForm(); // Instans form untuk form drawer

  // Mengambil data playlist saat komponen pertama kali render
  useEffect(() => {
    fetchPlaylistData();
  }, []);

  //Memfilter data playlist saat searchText atau playlistData berubah
  //Mencari berdasarkan judul dan deskripsi playlist
  useEffect(() => {
    const filtered = playlistData.filter(item =>
      item.play_name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.play_description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText, playlistData]);

  //Fungsi untuk mengambil data playlist dari API
  const fetchPlaylistData = () => {
    setLoading(true);
    getData("/api/playlist/45")
      .then((response) => {
        if (response && Array.isArray(response.datas)) {
<<<<<<< HEAD
          setPlaylistData(response.datas); // Menyimpan data asli
          setFilteredData(response.datas); // Menyimpan data hasil filter
=======
        const educationData = response.datas.filter(
          (item) => item.play_genre === "education"
        );
          setPlaylistData(educationData);
          setFilteredData(educationData);
>>>>>>> b4ae410dc3995f0a902bcc381f8a1be850f35461
        } else {
          showAlert("error", "Error", "No data available"); 
          setPlaylistData([]); // Reset data jika response tidak valid
        }
      })
      .catch(() => {
        showAlert("error", "Error", "Failed to load playlist data");
      })
      .finally(() => setLoading(false)); // Menyembunyikan loading
  };

  // Menampilkan notifikasi
  //  * @param {string} status - Jenis notifikasi ('success', 'error', dll)
  //  * @param {string} title - Judul notifikasi
  //  * @param {string} description - Pesan notifikasi
  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  // Menghandle penghapusan playlist
  //  * @param {number} id - ID playlist yang akan dihapus
  const handleDelete = (id) => {
    deleteData(`/api/playlist/${id}`)
      .then((response) => {
        if (response.status === 404) {
          showAlert("error", "Failed", "Playlist not found");
        } else {
          showAlert("success", "Success", "Playlist deleted successfully");
          fetchPlaylistData(); // Memperbarui data setelah penghapusan
        }
      })
      .catch((error) => {
        showAlert("error", "Failed", "An error occurred while deleting the data");
        console.error(error);
      });
  };

  // Menghandle submit form (baik create maupun update)
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("play_name", values.title);
        formData.append("play_genre", "education"); // Default genre 'education'
        formData.append("play_url", values.url);
        formData.append("play_description", values.description);
        formData.append("play_thumbnail", values.thumbnail);

        // Tentukan endpoint API berdasarkan mode edit
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
              setOpenDrawer(false); // Tutup drawer
              fetchPlaylistData(); // Segarkan data
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

  // Mengatur mode edit untuk playlist
  // @param {object} item - Data playlist yang akan diedit
  const handleEdit = (item) => {
    form.setFieldsValue({
      title: item.play_name,
      url: item.play_url,
      description: item.play_description,
      thumbnail: item.play_thumbnail
    });
    setCurrentId(item.id_play); // Simpan ID untuk operasi update
    setEditMode(true); // Aktifkan mode edit
    setOpenDrawer(true); // Buka drawer
  };

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">
            
            {/* Tombol aksi mengambang untuk menambah playlist baru */}
            <FloatButton
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => {
                form.resetFields(); 
                setEditMode(false); 
                setOpenDrawer(true); 
              }}
            />

            {/* Drawer untuk menambah/mengedit playlist */}
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

              {/* Form untuk data playlist */}
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

            {/* Header halaman */}
            <Title level={2}>Playlist Edukasi</Title>
            <Text style={{ fontSize: "12pt" }}>Daftar video pembelajaran</Text>
            
            {/* Input pencarian */}
            <Input
              prefix={<SearchOutlined />}
              placeholder="Cari video..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              className="header-search"
              size="large"
              style={{ marginBottom: 24 }}
            />

            {/* Render bersyarat berdasarkan state */}
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