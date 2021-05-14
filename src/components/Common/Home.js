import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Card, Avatar, AutoComplete, Row, Col, Button, Layout, Pagination, Select, Tree, Typography, Rate, Breadcrumb, Divider } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-t1.svg";
import API from "../../api";

const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;


export default function Home() {

    const history = useHistory();
    const { Option } = Select;


    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [filteredPlaceResult, setFilteredPlaceResult] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [placeResults, setPlaceResults] = useState([
        { key: "Izmir", value: "Izmir" },
        { key: "Ankara", value: "Ankara" },
        { key: "Konak", value: "Konak" },
        { key: "Buca", value: "Buca" },
        { key: "Urla", value: "Urla" }

    ]);

    const [serviceResults, setServiceResults] = useState([]);
    const [filteredServiceResults, setFilteredServiceResults] = useState([]);

    const onExpand = (expandedKeysValue) => {
        console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.

        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    const getAllPlaces = useCallback(async () => {
        await API.get(`place/getAllPlaces`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setPlaceResults(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });


    const getAllServices = useCallback(async () => {
        await API.get(`categories/getAllServices`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setServiceResults(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });


    const getServicesTree = useCallback(async () => {
        await API.get(`categories/getAllServicesTree`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setTreeData(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    });


    useEffect(async () => {
        getAllPlaces();
        getAllServices();
        getServicesTree();
    }, []);

    const AutoCompleteOption = AutoComplete.Option;

    const handlePlaceSearch = (value) => {
        let res = [];
        if (!value) {
            res = [];
        } else {
            res = placeResults.filter((item) => item.value.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
        }

        setFilteredPlaceResult(res);
    };

    const handleServiceSearch = (value) => {
        let res = [];
        if (!value) {
            res = [];
        } else {
            res = serviceResults.filter((item) => item.value.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
        }

        setFilteredServiceResults(res);
    };

    function onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
    }

    const handleSortChange = useCallback((value) => {
    }, []);

    return (
        <div>
            <Layout>
                <Header className="header" style={{ backgroundColor: "#1890ff" }}>
                    <div className="logo">
                        <img src={logo} style={{
                            float: "left",
                            width: "202px",
                            height: "75px"
                        }} />
                    </div>
                    <div style={{
                        float: "right"
                    }}>
                        <Link style={{ color: "white", marginRight: 10 }} to="/login">Giriş Yap</Link>
                        <Button style={{ color: "#d46b08", borderColor: "#d46b08" }}>Üye Ol</Button>
                    </div>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 10, marginLeft: '10%' }}>
                    <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                        <Sider className="site-layout-background" width={200} style={{ backgroundColor: "white" }}>
                            <div>
                                <div style={{ textAlign: "left", padding: '0 50px', marginTop: 10 }}> <Text className="ant-card-meta-title">Hizmetler</Text></div>
                                <Tree
                                    checkable
                                    onExpand={onExpand}
                                    expandedKeys={expandedKeys}
                                    autoExpandParent={autoExpandParent}
                                    onCheck={onCheck}
                                    checkedKeys={checkedKeys}
                                    onSelect={onSelect}
                                    selectedKeys={selectedKeys}
                                    treeData={treeData}
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                />
                                <Button type="primary" style={{ paddingBottom: 10, marginLeft: 5, width: '94%' }} block>Ara</Button>
                            </div>
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>

                            <div className="site-layout-content">
                                <Row style={{ marginBottom: 10 }}>
                                    <Col>
                                        <AutoComplete
                                            style={{ width: 300, marginRight: 10 }}
                                            onSearch={handlePlaceSearch}
                                            placeholder="İl, İlçe veya Bölge Giriniz"
                                        >
                                            {filteredPlaceResult.map(({ key, value }) => (
                                                <AutoCompleteOption key={key}>
                                                    {value}
                                                </AutoCompleteOption>
                                            ))}
                                        </AutoComplete>
                                    </Col>
                                    <Col>
                                        <AutoComplete
                                            style={{ width: 300, marginRight: 10 }}
                                            placeholder="Almak İstediğiniz Hizmeti Giriniz"
                                            onSearch={handleServiceSearch}
                                        >
                                            {filteredServiceResults.map(({ key, value }) => (
                                                <Option key={key}>
                                                    {value}
                                                </Option>
                                            ))}
                                        </AutoComplete>
                                    </Col>
                                    <Col>
                                        <Button style={{ width: 100, marginRight: 10, backgroundColor: "#d46b08", color: "white" }}>Ara</Button>
                                    </Col>
                                    <Select
                                        style={{ width: 300, marginRight: 10 }}
                                        defaultValue="Seçiniz"
                                        onChange={handleSortChange}
                                    >
                                        <Option key={"ascByPoint"}>
                                            Puana Göre Artan
                                        </Option>
                                        <Option key={"descByPoint"}>
                                            Puana Göre Azalan
                                        </Option>
                                        <Option key={"ascByCommentCount"}>
                                            Yorum Sayısına Göre Artan
                                        </Option>
                                        <Option key={"descByCommentCount"}>
                                            Yorum Sayısına Göre Azalan
                                        </Option>
                                        <Option key={"descByPrice"}>
                                            Fiyatına Göre Artan
                                        </Option>
                                        <Option key={"descByPrice"}>
                                            Fiyatına Göre Azalan
                                        </Option>
                                    </Select>
                                </Row>
                                <Card
                                    style={{ width: '80%', marginBottom: 20 }}
                                >
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col className="gutter-row" span={8}>
                                            <img
                                                alt="example"
                                                style={{
                                                    maxWidth: '100%'
                                                }}
                                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                            />
                                        </Col>
                                        <Col className="gutter-row" span={16} marginTop={10}>
                                            <Row span={24} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                <Col className="gutter-row" span={16} style={{ float: "left" }} className="ant-card-meta-title">Card title</Col>
                                                <Col className="gutter-row" span={8}><Rate allowHalf defaultValue={4} /></Col>
                                            </Row>
                                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                                <Col><Breadcrumb>
                                                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                                                    <Breadcrumb.Item>
                                                        <a href="">Application List</a>
                                                    </Breadcrumb.Item>
                                                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                                                </Breadcrumb></Col>
                                            </Row>

                                            <Row style={{ marginTop: 15 }}><Col className="ant-card-meta-description">This is the description This is the description This is the description This is the description This is the descriptionThis is the description This is the descriptionThis is the descriptionThis is the description</Col></Row>
                                            <Row style={{ marginTop: 15 }}>
                                                <Col>
                                                    <text style={{ fontWeight: 500 }}>Fiyat: 50 tl</text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row style={{ height: 20, borderTop: "1px solid #f0f0f0", marginTop: 15 }}>
                                        <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                            <Button type="link" icon={<EditOutlined />}>
                                                Randevu Oluştur
                                            </Button>
                                            <Divider type="vertical" />
                                        </Col>
                                        <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                            <Button type="link" icon={<EditOutlined />}>
                                                Salonu Görüntüle
                                            </Button>
                                            <Divider type="vertical" />
                                        </Col>

                                    </Row>

                                </Card>
                                <Card
                                    style={{ width: '80%', marginBottom: 20 }}
                                    cover={
                                        <img
                                            alt="example"
                                            style={{ width: 262, height: 159 }}
                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                        />
                                    }
                                    actions={[
                                        <SettingOutlined key="setting" />,
                                        <EditOutlined key="edit" />,
                                        <EllipsisOutlined key="ellipsis" />,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title="Card title"
                                        description="This is the description"
                                    />
                                </Card>
                                <Card
                                    style={{ width: '80%', marginBottom: 20 }}
                                    cover={
                                        <img
                                            alt="example"
                                            style={{ width: 262, height: 159 }}
                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                        />
                                    }
                                    actions={[
                                        <SettingOutlined key="setting" />,
                                        <EditOutlined key="edit" />,
                                        <EllipsisOutlined key="ellipsis" />,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title="Card title"
                                        description="This is the description"
                                    />
                                </Card>
                                <Card
                                    style={{ width: '80%', marginBottom: 20 }}
                                    cover={
                                        <img
                                            alt="example"
                                            style={{ width: 262, height: 159 }}
                                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                        />
                                    }
                                    actions={[
                                        <SettingOutlined key="setting" />,
                                        <EditOutlined key="edit" />,
                                        <EllipsisOutlined key="ellipsis" />,
                                    ]}
                                >
                                    <Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title="Card title"
                                        description="This is the description"
                                    />
                                </Card>
                                <Pagination
                                    showSizeChanger
                                    onShowSizeChange={onShowSizeChange}
                                    defaultCurrent={3}
                                    total={500}
                                />
                            </div>
                        </Content>
                    </Layout>

                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        </div >
    );
}
