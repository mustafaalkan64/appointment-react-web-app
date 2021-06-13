import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Card, Image, AutoComplete, Row, Col, Skeleton, Button, Layout, Pagination, Select, Rate, Breadcrumb, Divider, Alert } from 'antd';
import { EditOutlined, ShopOutlined } from '@ant-design/icons';
import API from "../../api";
import { imageUrlDirectory } from "../../constUrls";
import MainHeader from "./MainHeader";


const { Content, Footer } = Layout;
// const { Text } = Typography;


export default function Home() {

    const history = useHistory();
    const { Option } = Select;


    // const [expandedKeys, setExpandedKeys] = useState([]);
    // const [checkedKeys, setCheckedKeys] = useState([]);
    // const [selectedKeys, setSelectedKeys] = useState([]);
    // const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [filteredPlaceResult, setFilteredPlaceResult] = useState([]);
    // const [treeData, setTreeData] = useState([]);
    const [placeResults, setPlaceResults] = useState([]);
    const [saloonResults, setSaloonResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [serviceResults, setServiceResults] = useState([]);
    const [filteredServiceResults, setFilteredServiceResults] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(10);
    const [sortValue, setSortValue] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // const onExpand = (expandedKeysValue) => {
    //     console.log('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    //     // or, you can remove all expanded children keys.

    //     setExpandedKeys(expandedKeysValue);
    //     setAutoExpandParent(false);
    // };

    // const onCheck = (checkedKeysValue) => {
    //     console.log('onCheck', checkedKeysValue);
    //     setCheckedKeys(checkedKeysValue);
    // };

    // const onSelect = (selectedKeysValue, info) => {
    //     console.log('onSelect', info);
    //     setSelectedKeys(selectedKeysValue);
    // };

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


    // const getServicesTree = useCallback(async () => {
    //     await API.get(`categories/getAllServicesTree`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then((res) => {
    //             setTreeData(res.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // });


    useEffect(async () => {
        getAllPlaces();
        getAllServices();
        // getServicesTree();
    }, [getAllPlaces, getAllServices]);

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

    const search = useCallback(() => {
        setLoading(true);
        var searchModel = {
            Place: selectedPlaceId,
            Service: selectedServiceId,
            Page: pageNumber,
            PageSize: 10,
            SortValue: sortValue
        };
        API.get(`home/search`, { params: searchModel }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setSaloonResults(res.data.item1);
                setPageCount(res.data.item2);
                setLoading(false);
                setHasSearched(true);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [pageNumber, selectedPlaceId, selectedServiceId, sortValue]);

    const handleServiceSearch = (value) => {
        let res = [];
        if (!value) {
            res = [];
        } else {
            res = serviceResults.filter((item) => item.value.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
        }

        setFilteredServiceResults(res);
    };

    const onShowSizeChange = (current, pageSize) => {
        console.log(current, pageSize);
    }

    const onPageChange = async (page) => {
        setLoading(true);
        setPageNumber(page);
        var searchModel = {
            Place: selectedPlaceId,
            Service: selectedServiceId,
            Page: page,
            PageSize: 10,
            SortValue: sortValue
        };
        API.get(`home/search`, { params: searchModel }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setSaloonResults(res.data.item1);
                setPageCount(res.data.item2);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    const redirectToSaloonDetailPage = (urlSaloonTitle) => {
        history.push("/saloonDetail/" + urlSaloonTitle);
    }

    const onPlaceSearch = async (value, option) => {
        setSelectedPlaceId(option.key);
    };

    const onServiceSearch = (value, option) => {
        setSelectedServiceId(option.key);
    };

    const handleSortChange = useCallback((value) => {
        setSortValue(value);
        var searchModel = {
            Place: selectedPlaceId,
            Service: selectedServiceId,
            Page: pageNumber,
            PageSize: 10,
            SortValue: value
        };
        API.get(`home/search`, { params: searchModel }, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setSaloonResults(res.data.item1);
                setPageCount(res.data.item2);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [pageNumber, selectedPlaceId, selectedServiceId, sortValue]);

    return (
        <div>
            <Layout>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 50px', marginTop: 10, marginLeft: '10%' }}>
                    {/* <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
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
                        </Sider> */}

                    <div className="site-layout-content">
                        <Row style={{ marginBottom: 10 }}>
                            <Col>
                                <AutoComplete
                                    style={{ width: 300, marginRight: 10 }}
                                    onSearch={handlePlaceSearch}
                                    onSelect={onPlaceSearch}
                                    showSearch
                                    placeholder="İl, İlçe veya Bölge Giriniz"
                                >
                                    {filteredPlaceResult.map(({ key, value }) => (
                                        <AutoCompleteOption key={key} value={value}>
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
                                    onSelect={onServiceSearch}
                                    showSearch
                                >
                                    {filteredServiceResults.map(({ key, value }) => (
                                        <Option key={key} value={value}>
                                            {value}
                                        </Option>
                                    ))}
                                </AutoComplete>
                            </Col>
                            <Col>
                                <Button onClick={() => search()} style={{ width: 100, marginRight: 10, backgroundColor: "#d46b08", color: "white" }}>Ara</Button>
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
                                <Option key={"ascByPrice"}>
                                    Fiyatına Göre Artan
                                        </Option>
                                <Option key={"descByPrice"}>
                                    Fiyatına Göre Azalan
                                        </Option>
                            </Select>
                        </Row>
                        {
                            loading ? (
                                <div>
                                    <Skeleton active avatar />
                                    <Skeleton active avatar />
                                    <Skeleton active avatar />
                                    <Skeleton active avatar />
                                </div>

                            ) : ((saloonResults.length > 0) ? (saloonResults.map((value) => (
                                <Card
                                    style={{ width: '80%', marginBottom: 20, height: '600' }}
                                >
                                    <Row>
                                        <Col xs={24} xl={8} style={{ paddingRight: "10px" }}>
                                            <Image
                                                alt="example"
                                                style={{ width: "100%", height: "130px" }}
                                                // src={imageUrlDirectory + "empty-img.png"}
                                                src={imageUrlDirectory + value.image}
                                            />
                                        </Col>
                                        <Col xs={24} xl={16} marginTop={10} marginLeft={10}>
                                            <Row >
                                                <Col xs={24} xl={16} style={{ float: "left" }} className="ant-card-meta-title">{value.saloonHeader}</Col>
                                                <Col xs={24} xl={8}><Rate allowHalf defaultValue={value.rate} /></Col>
                                            </Row>
                                            <Row>
                                                <Col><Breadcrumb>
                                                    <Breadcrumb.Item>{value.city}</Breadcrumb.Item>
                                                    <Breadcrumb.Item>
                                                        {value.district}
                                                    </Breadcrumb.Item>
                                                    <Breadcrumb.Item>{value.zone}</Breadcrumb.Item>
                                                    <Breadcrumb.Item>{value.serviceName}</Breadcrumb.Item>
                                                </Breadcrumb></Col>
                                            </Row>

                                            <Row style={{ marginTop: 15 }}><Col className="ant-card-meta-description">{value.saloonDescription}</Col></Row>
                                            <Row style={{ marginTop: 15 }}>
                                                <Col>
                                                    <text style={{ fontWeight: 500 }}>Fiyat: {value.price} tl</text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row style={{ height: 25, borderTop: "1px solid #f0f0f0", paddingTop: 5, marginTop: 10 }}>
                                        <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                            <Button type="link" icon={<EditOutlined />}>
                                                Randevu Oluştur
                                                        </Button>
                                            <Divider type="vertical" />
                                        </Col>
                                        <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                            <Button type="link" icon={<ShopOutlined />} onClick={() => redirectToSaloonDetailPage(value.urlSaloonTitle)}>
                                                Salonu Görüntüle
                                                        </Button>
                                        </Col>

                                    </Row>

                                </Card>
                            ))) : (hasSearched ? (<Alert
                                message="Hata"
                                description="Sonuç Bulunamadı"
                                type="error"
                                showIcon
                            />) : (<div></div>)))

                        }



                        <Pagination
                            showSizeChanger
                            onChange={onPageChange}
                            defaultPageSize={10}
                            style={{ marginTop: 10 }}
                            onShowSizeChange={onShowSizeChange}
                            defaultCurrent={1}
                            total={pageCount}
                        />
                    </div>
                    {/* </Layout> */}

                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        </div >
    );
}
