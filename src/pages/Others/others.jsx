import {
  Col, Row, Typography, Card, List, FloatButton, Drawer, Form, Input, Button, notification, Popconfirm
} from "antd";
import { useEffect, useState } from "react";
import {
  DeleteColumnOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import { getData, sendData, deleteData } from "../../utils/api";

const { Title, Text } = Typography;

const Others = () => {
  const [api, contextHolder] = notification.useNotification();
  const [dataSources, setDataSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [formInputNature] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    getDataOthers();
  }, []);

  const openNotificationWithIcon = (type, Title, msg) => {
    api[type]({
      message: Title,
      description: msg,
    });
  };

  const getDataOthers = async () => {
    setIsLoading(true);
    try {
      const resp = await getData("/api/v1/natures");
      setIsLoading(false);
      if (resp) {
        setDataSources(resp);
      } else {
        console.log("Something went wrong");
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  const handleDrawer = () => {
    setIsOpenDrawer(true);
  };

  const onCloseDrawer = () => {
   
    if (isEdit) {
      setIsEdit(false);
      setIdSelected(null);
    }
    
    setIsOpenDrawer(false);
    formInputNature.resetFields();
    
  };

  const handleSubmit = () => {
    let title = formInputNature.getFieldValue("title");
    let description = formInputNature.getFieldValue("Description");

    let formData = new FormData();
    formData.append("name_natures", title);
    formData.append("description", description);

    let url = isEdit ? `/api/v1/natures/${idSelected}` : "/api/v1/natures";
    let msg = isEdit ? ", Sukses mengubah data" : ", Sukses menambahkan data";
    

    sendData(url, formData)
      .then((resp) => {
        if (resp?.datas) {
          openNotificationWithIcon("success", "Data Others", "Data Berhasil Dikirim"+ msg);
          getDataOthers();
          formInputNature.resetFields();
          onCloseDrawer();
        } else {
          openNotificationWithIcon("error", "Data Others", "Data Gagal Terkirim");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDrawerEdit = (record) => {
    setIsOpenDrawer(true);
    setIsEdit(true);
    setIdSelected(record?.id);
    formInputNature.setFieldsValue({
      title: record?.name_natures,
      Description: record?.description,
    });
  };
  
  const handleSearch = (search) => {
    setSearchText(search.toLowerCase());
  };

  let dataSourcesFiltered = dataSources.filter((item) => {
    return item?.name_natures.toLowerCase().includes(searchText);
  });

  const confirmDelete =  (record) => {
    let url = `/api/v1/natures/${record?.id}`;
    let params = new URLSearchParams();
    params.append("id", record?.id);
    deleteData(url, params)
      .then((resp) => {
        if (resp?.status=== 200) {
          openNotificationWithIcon("success", "Data Others", "Data Berhasil Dihapus");
          getDataOthers();
        } else {
          openNotificationWithIcon("error", "Data Others", "Data Gagal Dihapus");
        }
      })
      .catch((err) => {
        console.log(err);
      });

  };
  return (
    <div className="layout-content">
      {contextHolder}
      <Row gutter={[24, 0]}>
        <Col xs={23} className="mb-24">
          <Card bordered={false} className="circlebox h-full w-full">
            <FloatButton
              shape="circle"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={handleDrawer}
            />

            <Drawer
              title={isEdit ? "Edit Data" : "Tambah Data"}
              onClose={onCloseDrawer}
              open={isOpenDrawer}
              extra={
                <Button type="primary" onClick={handleSubmit}>
                  SUBMIT
                </Button>
              }
            >
              <Form form={formInputNature} layout="vertical">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Please input your title!" }]}
                >
                  <Input placeholder="Title" />
                </Form.Item>

                <Form.Item label="Description" name="Description">
                  <Input.TextArea rows={3} placeholder="Description" />
                </Form.Item>
              </Form>
            </Drawer>

            <Title>List of Nature</Title>
            <Text style={{ fontSize: "12pt" }}>Tambahkan Konten Disini...</Text>
            <Input 
              prefix={<SearchOutlined />}
              placeholder="input search text"
              className="Header Search"
              allowClear
              size="large"
              onChange={(e) => handleSearch(e.target.value)}
            /> 
            {isLoading ? (
              <div>Sedang menunggu data...</div>
            ) : (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 3,
                }}
                dataSource={dataSourcesFiltered ?? []}
                renderItem={(item) => (
                  <List.Item key={item?.id}>
                    <Card
                      cover={
                        <img
                          key={item?.id}
                          src={`${item?.url_photo}`}
                          alt="categories-image"
                        />
                      }
                      actions={[
                        <EditOutlined onClick={() => handleDrawerEdit(item)} />,
                        <SearchOutlined key={item?.id}/>,
                        
                        <Popconfirm
                          title="Delete the task"
                          description={`apakah kamu yakin menghapus data ${item?.name_natures }?`}
                          onConfirm={() => confirmDelete(item)} // Kirim item sebagai parameter
                          onCancel={() => console.log("cancel")}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined key={item?.id} />
                        </Popconfirm>
                        
                      ]}
                    >
                      <Card.Meta
                        title={<Text>{item?.name_natures}</Text>}
                        description={<Text>{item?.description}</Text>}
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
