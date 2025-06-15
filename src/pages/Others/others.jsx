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

const Others = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [genreFilter, setGenreFilter] = useState("all");

  const filteredData = genreFilter === "all"
     ? playlistData
     : playlistData.filter(item => item.play_genre === genreFilter);
 

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = () => {
    setLoading(true);
    getData("/api/playlist/45")
      .then((response) => {
        if (response && Array.isArray(response.datas)) {
          const OthersData = response.datas.filter(
            (item) => item.play_genre === "others"
          );
          setPlaylistData(OthersData);
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

  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={24}>
          <Card bordered={false} className="circlebox h-full w-full">
            <Title level={2}>Playlist Lainnya</Title>
            <Text style={{ fontSize: "12pt" }}>Daftar video pembelajaran</Text>

            {/* Filter genre dengan style tab */}
            <div style={{ margin: "16px 0", textAlign: "right" }}>
              <Button.Group>
                <Button
                  type={genreFilter === "song" ? "primary" : "default"}
                  style={{
                    borderRadius: "20px 0 0 20px",
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
            ) : playlistData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Text type="secondary">
                  {'Belum ada data playlist'}
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
                dataSource={playlistData}
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

export default Others;