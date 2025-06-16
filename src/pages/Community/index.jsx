import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Row, Col, notification, Spin, Avatar, Tag } from 'antd';
import { PlusOutlined, UserOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

// Data Dummy untuk Halaman Komunitas
const dummyCommunityPlaylists = [
  {
    id: 'comm_001',
    title: 'Belajar Desain Grafis dari Nol',
    description: 'Kumpulan video tutorial esensial untuk siapa saja yang ingin memulai karir di dunia desain grafis, dari teori warna hingga penggunaan software.',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop',
    genre: 'edukasi',
    creatorName: 'Kelas Desain',
    creatorAvatar: 'https://i.pravatar.cc/150?u=kelasdesain'
  },
  {
    id: 'comm_002',
    title: 'Movie Soundtracks: Epic & Emotional',
    description: 'Rasakan kembali momen-momen sinematik tak terlupakan dengan kompilasi soundtrack film terbaik yang megah dan menyentuh.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
    genre: 'movie',
    creatorName: 'Cinema Vibes',
    creatorAvatar: 'https://i.pravatar.cc/150?u=cinema'
  },
  {
    id: 'comm_003',
    title: 'Acoustic Cafe Session',
    description: 'Koleksi lagu-lagu akustik yang tenang dan syahdu, teman sempurna untuk secangkir kopi atau saat sedang bersantai.',
    thumbnail: 'https://img.youtube.com/vi/MYPVQccHhAQ/mqdefault.jpg',
    genre: 'song',
    creatorName: 'Andini',
    creatorAvatar: 'https://i.pravatar.cc/150?u=andini'
  },
  {
    id: 'comm_004',
    title: 'Deep Focus: Electronic & Lofi',
    description: 'Alunan musik elektronik dan lofi hip-hop yang dirancang untuk membantu Anda berkonsentrasi penuh saat bekerja atau belajar.',
    thumbnail: 'https://img.youtube.com/vi/ptHnmgaFvwE/mqdefault.jpg',
    genre: 'music',
    creatorName: 'Budi Santoso',
    creatorAvatar: 'https://i.pravatar.cc/150?u=budi'
  },
  {
    id: 'comm_005',
    title: 'Sejarah Dunia dalam Video Animasi',
    description: 'Pelajari peristiwa-peristiwa penting dalam sejarah dunia melalui video animasi yang menarik dan mudah dipahami.',
    thumbnail: 'https://img.youtube.com/vi/5KNoTp3kLlM/mqdefault.jpg',
    genre: 'edukasi',
    creatorName: 'Eka Wijaya',
    creatorAvatar: 'https://i.pravatar.cc/150?u=eka'
  },
  {
    id: 'comm_006',
    title: 'Golden Age of Hollywood',
    description: 'Kumpulan trailer dan klip dari film-film klasik era keemasan Hollywood yang tak lekang oleh waktu.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop',
    genre: 'movie',
    creatorName: 'Citra Dewi',
    creatorAvatar: 'https://i.pravatar.cc/150?u=citra'
  },
  {
    id: 'comm_007',
    title: 'Top Hits Indonesia 90an',
    description: 'Bernostalgia dengan lagu-lagu terbaik dari musisi Indonesia di era 90-an.',
    thumbnail: 'https://img.youtube.com/vi/tVdTUvBktwc/mqdefault.jpg',
    genre: 'song',
    creatorName: 'Nostalgia 90s',
    creatorAvatar: 'https://i.pravatar.cc/150?u=90s'
  },
  {
    id: 'comm_008',
    title: 'Classical Music for Reading',
    description: 'Musik klasik gubahan Mozart, Beethoven, dan Bach untuk menciptakan suasana membaca yang tenang dan fokus.',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070&auto=format&fit=crop',
    genre: 'music',
    creatorName: 'Dharma',
    creatorAvatar: 'https://i.pravatar.cc/150?u=dharma'
  }
];

const Community = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState(new Set());

  const [notificationApi, contextHolder] = notification.useNotification();

  useEffect(() => {
    setLoadingPage(true);
    setTimeout(() => {
      setPlaylists(dummyCommunityPlaylists);
      setLoadingPage(false);
    }, 1500);
  }, []);

  const handleAddToMyPlaylist = (playlist) => {
    setAddingId(playlist.id);

    setTimeout(() => {
      notificationApi.success({
        message: 'Playlist Ditambahkan!',
        description: `"${playlist.title}" oleh ${playlist.creatorName} telah berhasil ditambahkan ke koleksi Anda.`,
        placement: 'topRight',
      });

      setAddedPlaylistIds(prevIds => new Set(prevIds).add(playlist.id));

      setAddingId(null); 
    }, 2000);
  };

  return (
     <div style={{ padding: '8px 24px', background: 'white', borderRadius: '12PX' , maxWidth:2000, margin: '24px auto' }}>
      {contextHolder}
      <Title level={2}>Jelajahi Playlist Komunitas</Title>
      <Paragraph type="secondary">
        Temukan dan dapatkan inspirasi dari playlist yang dibuat oleh pengguna lain di seluruh dunia.
      </Paragraph>

      <Spin spinning={loadingPage} tip="Memuat playlist komunitas...">
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {playlists.map((item) => {
            
            // Logika kondisional untuk mengubah tampilan tombol
            const isAdded = addedPlaylistIds.has(item.id); 
            const isLoading = addingId === item.id; 
            const isButtonDisabled = isAdded || (addingId !== null && addingId !== item.id);

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <Card
                  hoverable
                  cover={<img alt={item.title} src={item.thumbnail} style={{ height: 180, objectFit: 'cover' }} />}
                  actions={[
                    <Button
                      type={isAdded ? 'default' : 'primary'}
                      icon={isAdded ? <CheckOutlined /> : <PlusOutlined />}
                      onClick={() => !isAdded && handleAddToMyPlaylist(item)}
                      loading={isLoading}
                      disabled={isButtonDisabled}
                      style={isAdded ? { borderColor: '#52c41a', color: '#52c41a', cursor: 'default' } : {}}
                    >
                      {isLoading ? 'Menambahkan...' : (isAdded ? 'Telah Ditambahkan' : 'Tambah ke Saya')}
                    </Button>
                  ]}
                >
                  <Meta
                    avatar={<Avatar src={item.creatorAvatar} icon={<UserOutlined />} />}
                    title={item.title}
                    description={
                      <>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                          Dibuat oleh: <strong>{item.creatorName}</strong>
                        </Text>
                        <Tag color="blue">{item.genre}</Tag>
                      </>
                    }
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      </Spin>
     </div>
  );
};

export default Community;