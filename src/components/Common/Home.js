import React, { useState, useCallback } from "react";
import { useHistory } from "react-router";
import { Card, Image, AutoComplete, Row, Col, Skeleton, Button, Layout, Pagination, Select, Rate, Breadcrumb, Divider, Alert, Form, message } from 'antd';
import { EditOutlined, ShopOutlined } from '@ant-design/icons';
import API from "../../api";
import { imageUrlDirectory } from "../../constUrls";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { cardStyle, headStyle } from "../../assets/styles/styles";


const { Content } = Layout;

export default function Home() {

    const history = useHistory();
    const { Option } = Select;

    const [placeResults, setPlaceResults] = useState([]);
    const [saloonResults, setSaloonResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [serviceResults, setServiceResults] = useState([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(10);
    const [sortValue, setSortValue] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [form] = Form.useForm();

    // const getAllPlaces = useCallback(async () => {
    //     await API.get(`place/getAllPlaces`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then((res) => {
    //             setPlaceResults(res.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);


    // const getAllServices = useCallback(async () => {
    //     await API.get(`categories/getAllServices`, {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then((res) => {
    //             setServiceResults(res.data);
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }, []);


    // useEffect(() => {
    //     getAllPlaces();
    //     getAllServices();
    // }, [getAllPlaces, getAllServices]);

    const AutoCompleteOption = AutoComplete.Option;

    const handlePlaceSearch = async (value) => {

        await API.get(`place/getPlacesByQuery?query=${value}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setPlaceResults(res.data);
                // setFilteredPlaceResult(res);
            })
            .catch((error) => {
                console.log(error);
            });

        // let res = [];
        // if (!value) {
        //     res = [];
        // } else {
        //     res = placeResults.filter((item) => item.value.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
        // }

        // setFilteredPlaceResult(res);
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

    const handleServiceSearch = async (value) => {

        await API.get(`categories/getAllServicesByQuery?query=${value}`, {
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

        // let res = [];
        // if (!value) {
        //     res = [];
        // } else {
        //     res = serviceResults.filter((item) => item.value.toLocaleUpperCase('tr-TR').includes(value.toLocaleUpperCase('tr-TR')));
        // }

        // setFilteredServiceResults(res);
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

    const redirectToSaloonDetailPage = (urlSaloonTitle, id) => {
        history.push(`/saloonDetail/${urlSaloonTitle}/${id}`);
    }

    const onPlaceSearch = async (value, option) => {
        setSelectedPlaceId(option.key);
    };

    const clearPlaceSearch = async () => {
        setSelectedPlaceId(null);
    };

    const clearServiceSearch = async () => {
        setSelectedServiceId(null);
    };

    const onServiceSearch = (value, option) => {
        setSelectedServiceId(option.value);
    };

    const handleSortChange = useCallback((value) => {
        if (selectedPlaceId === null || selectedServiceId === null) {
            message.error("Aradığınız Hizmeti ve Konumu Giriniz");
            return;
        }
        setLoading(true);
        setSortValue(value);
        var searchModel = {
            Place: selectedPlaceId,
            Service: selectedServiceId,
            Page: pageNumber,
            PageSize: 10,
            SortValue: value
        };
        API.get(`home / search`, { params: searchModel }, {
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
    }, [pageNumber, selectedPlaceId, selectedServiceId]);

    const onFinish = () => {
        search();
    };

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 10px', marginTop: 10, marginRight: "10%", marginLeft: '10%' }}>
                    <Card
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}>
                        <div>
                            <Form
                                form={form}
                                name="advanced_search"
                                className="ant-advanced-search-form"
                                onFinish={onFinish}
                                layout="inline"
                            >
                                <Row >
                                    <Col key={"col-place"}>
                                        <Form.Item
                                            name={"place"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Konum Giriniz',
                                                },
                                            ]}
                                        >
                                            <AutoComplete
                                                onSearch={handlePlaceSearch}
                                                onSelect={onPlaceSearch}
                                                showSearch
                                                allowClear
                                                onClear={clearPlaceSearch}
                                                style={{ width: 300 }}
                                                placeholder="İl, İlçe veya Bölge Giriniz"
                                            >
                                                {
                                                    placeResults.map((element, index) => (
                                                        <AutoCompleteOption key={element.placeCode} value={element.placeName}>
                                                            {element.placeName}
                                                        </AutoCompleteOption>
                                                    ))
                                                }
                                            </AutoComplete>
                                        </Form.Item>
                                    </Col>
                                    <Col key={"col-service"}>
                                        <Form.Item
                                            name={"service"}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Almak İstediğiniz Hizmeti Giriniz',
                                                },
                                            ]}
                                        >
                                            <AutoComplete
                                                placeholder="Almak İstediğiniz Hizmeti Giriniz"
                                                onSearch={handleServiceSearch}
                                                onSelect={onServiceSearch}
                                                allowClear
                                                onClear={clearServiceSearch}
                                                style={{ width: 300 }}
                                                showSearch
                                            >
                                                {serviceResults.map((element, index) => (
                                                    <Option key={element.serviceId} value={element.serviceName}>
                                                        {element.serviceName}
                                                    </Option>
                                                ))}
                                            </AutoComplete>
                                        </Form.Item>
                                    </Col>
                                    <Col key={"col-order"}>
                                        <Form.Item
                                            name={"order"}
                                        >
                                            <Select
                                                style={{ width: 300 }}
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
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col
                                        span={24}
                                        style={{
                                            textAlign: 'right',
                                            marginBottom: 10
                                        }}
                                    >
                                        <Button type="primary" htmlType="submit">
                                            Search
                                    </Button>

                                    </Col>
                                </Row>
                            </Form>
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
                                        style={{ width: '100%', marginBottom: 20, height: '600' }}
                                    >
                                        <Row>
                                            <Col xs={24} xl={8} style={{ paddingRight: "10px" }}>
                                                <Image
                                                    alt="example"
                                                    style={{ width: "90%", height: "130px" }}
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
                                                    <Col span={16}><Breadcrumb>
                                                        <Breadcrumb.Item>{value.city}</Breadcrumb.Item>
                                                        <Breadcrumb.Item>
                                                            {value.district}
                                                        </Breadcrumb.Item>
                                                        <Breadcrumb.Item>{value.zone}</Breadcrumb.Item>
                                                        <Breadcrumb.Item>{value.serviceName}</Breadcrumb.Item>
                                                    </Breadcrumb></Col>
                                                    <Col span={8}>
                                                        <span>{value.commentCount === 0 ? (<div>Henüz Yorum Yapılmamış</div>) : (<div>{value.commentCount} Yorum</div>)}</span>
                                                    </Col>
                                                </Row>

                                                <Row style={{ marginTop: 15 }}><Col className="ant-card-meta-description">{value.saloonDescription}</Col></Row>
                                                <Row style={{ marginTop: 15 }}>
                                                    <Col>
                                                        <text style={{ fontWeight: 500 }}>Fiyat: {value.price} tl</text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>

                                        <Row style={{ height: 40, borderTop: "1px solid #f0f0f0", paddingTop: 5, marginTop: 10 }}>
                                            <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                                <Button type="link" icon={<EditOutlined />}>
                                                    Randevu Oluştur
                                                        </Button>
                                                <Divider type="vertical" />
                                            </Col>
                                            <Col xs={24} xl={12} style={{ textAlign: "center" }}>
                                                <Button type="link" icon={<ShopOutlined />} onClick={() => redirectToSaloonDetailPage(value.urlSaloonTitle, value.saloonId)}>
                                                    Salonu Görüntüle
                                                        </Button>
                                            </Col>

                                        </Row>

                                        <Pagination
                                            showSizeChanger
                                            onChange={onPageChange}
                                            defaultPageSize={10}
                                            style={{ marginTop: 10 }}
                                            onShowSizeChange={onShowSizeChange}
                                            defaultCurrent={1}
                                            total={pageCount}
                                        />

                                    </Card>
                                ))) : (hasSearched ? (<Alert
                                    message="Üzgünüz"
                                    description="Aradığınız Kriterlere Uygun Sonuç Bulamadık"
                                    type="error"
                                    showIcon
                                />) : (<div></div>)))

                            }

                        </div>
                        {/* </Layout> */}
                    </Card>
                </Content>
                <MainFooter />
            </Layout >
        </div >
    );
}
