import React, { useEffect, useState } from 'react';
import { Card, Layout, message, Row, Col, Image, Rate, List, Skeleton, Breadcrumb, Pagination, Anchor, Alert } from 'antd';
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import {
    useParams
} from "react-router-dom";
import API from "../../api";
import { imageUrlDirectory } from "../../constUrls";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { Form, Input, Button } from 'antd';
const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 16,
    },
};

const { Link } = Anchor;

const { Content } = Layout;

const SaloonPage = () => {
    let { saloonId } = useParams();
    const [loading, setLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [imagesLoading, setImagesLoading] = useState(false);
    const [personelsLoading, setPersonelsLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [found, setFound] = useState(true);
    // const history = useHistory();
    const token = localStorage.getItem("auth_token");
    const [logo, setLogo] = useState("");
    const [saloonInformation, setSaloonInformation] = useState({});
    const [comments, setComments] = useState([]);
    const [modifiedCollection, setModifiedCollection] = useState([]);
    const [saloonPersonels, setSaloonPersonels] = useState([]);
    const [saloonServices, setSaloonServices] = useState([]);
    const getCurrentAnchor = () => '#components-anchor-demo-static';
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalCount, setTotalCount] = useState([]);

    function onChange(pageNumber) {
        setCommentLoading(true);
        setPage(pageNumber);
        API.get(`comments/getComments/${saloonId}/${pageSize}/${pageNumber}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setComments(res.data.item1.map((item, i) => item));
                setTotalCount(res.data.item2);
                setCommentLoading(false);
            })
            .catch((error) => {
                message.error(error.response.data.message);
                setCommentLoading(false);
            });
    }

    function showTotal(total) {
        return `Toplam ${total} Yorum`;
    }

    const onFinish = async (values) => {
        console.log(values);
        if (values.rate === undefined || values.rate === 0) {
            message.error("Lütfen salonu puanlayın");
            return false;
        }
        var commentModel = {
            Header: values.header,
            Rate: values.rate,
            Body: values.body,
            SaloonId: saloonId
        };

        setCommentLoading(true);
        await API.post(`comments/saveComment`, commentModel, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                message.success("Yorumunuz Kaydedildi. Onaylandıktan Sonra Yorumunuz Görünecektir!");
                setCommentLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 401 || error.response.status === 403) {
                    message.error("Yorum Yapabilmeniz İçin Kullanıcı Girişi Yapmanız Gerekmektedir!");
                } else {
                    message.error(error.response.data.message);
                }
                setCommentLoading(false);
            });

    };


    useEffect(() => {

        const getComments = async () => {
            setCommentLoading(true);
            const pageNumber = 1;
            setPage(pageNumber);
            await API.get(`comments/getComments/${saloonId}/${pageSize}/${pageNumber}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setComments(res.data.item1.map((item, i) => item));
                    setTotalCount(res.data.item2);
                    setCommentLoading(false);
                })
                .catch((error) => {
                    message.error(error.response.data.message);
                    setCommentLoading(false);
                });
        }

        // const getCommentsRateAverage = async () => {
        //     await API.get(`comments/getCommentsRateAverage/${localSaloonId}`, {
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     })
        //         .then((res) => {
        //             setRate(res.data);
        //         })
        //         .catch((error) => {
        //             message.error(error.response.data);
        //         });
        // }

        const getSaloonDetail = async () => {
            setLoading(true);
            await API.get(`home/getSaloonProfile?saloonId=${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setFound(true);
                    setSaloonInformation(res.data);
                    setLogo(imageUrlDirectory + res.data.logoUrl);
                    setLoading(false);
                    return true;
                })
                .catch((error) => {
                    if (error.response.status === 404) {
                        setFound(false);
                    } else {
                        message.error(error.response.data.message);
                    }
                    setLoading(false);
                    return false;
                });
        };

        const getSaloonServices = async () => {
            setServicesLoading(true);
            await API.get(`home/getSaloonServices?saloonId=${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setSaloonServices(res.data);
                    setServicesLoading(false);
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                    setServicesLoading(false);
                });
        };

        const getSaloonImages = async () => {
            setImagesLoading(true);
            await API.get(`home/getSaloonImages?saloonId=${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (res.data.length > 0) {
                        let modifiedCollections = res.data.reduce((rows, key, index) => {
                            return (index % 6 === 0 ? rows.push([key])
                                : rows[rows.length - 1].push(key)) && rows;
                        }, []);

                        setModifiedCollection(modifiedCollections);
                        // getCommentsRateAverage();

                    }
                    setImagesLoading(false);

                })
                .catch((error) => {
                    console.log(error.response.data.message);
                    setImagesLoading(false);
                });
        };

        const getSaloonPersonels = async () => {
            setPersonelsLoading(true);
            await API.get(`home/getSaloonPersonels?saloonId=${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setSaloonPersonels(res.data);
                    setPersonelsLoading(false);
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                    setPersonelsLoading(false);
                });
        };

        getSaloonDetail();
        getSaloonServices();
        getSaloonImages();
        getComments();
        getSaloonPersonels();

    }, [saloonId]);

    const convertToFullDate = (datetime) => {
        var d = new Date(datetime);
        var month = d.getUTCMonth() + 1; //months from 1-12
        var day = d.getDate();
        var year = d.getUTCFullYear();

        var minutes = d.getMinutes();
        var hour = d.getHours();

        var newdate = `${("0" + day).slice(-2)}.${("0" + month).slice(-2)}.${year} ${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}`;
        return newdate;
    };

    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 50px', margintop: 10, marginleft: '3%', marginRight: '2%' }}>

                    {found === true ? (<div className="site-layout-content">
                        {loading ? (
                            <div className="spinClass">
                                <Skeleton active />
                            </div>
                        ) : (
                            <Card
                                hoverable
                                bordered={true}
                                style={cardStyle}
                                headStyle={headStyle}>

                                <Row>
                                    <Col xs={24} xl={6} style={{ paddingRight: "10px" }}>
                                        <Image
                                            alt="example"
                                            style={{ width: "80%", height: "130px" }}
                                            // src={imageUrlDirectory + "empty-img.png"}
                                            src={logo}
                                        />
                                    </Col>
                                    <Col xs={24} xl={18} margintop={10} marginleft={10}>
                                        <Row >
                                            <Col xs={24} xl={16} style={{ float: "left" }} className="ant-card-meta-title">{saloonInformation.shopTitle}</Col>
                                            <Col xs={24} xl={8}><Rate allowHalf defaultValue={saloonInformation.averagePoint} /></Col>
                                        </Row>
                                        <Row >
                                            <Col xs={24} xl={16} style={{ float: "left" }} className="ant-card-meta-title">
                                                <Breadcrumb>
                                                    <Breadcrumb.Item>{saloonInformation.cityName}</Breadcrumb.Item>
                                                    <Breadcrumb.Item>
                                                        {saloonInformation.districtName}
                                                    </Breadcrumb.Item>
                                                    <Breadcrumb.Item>{saloonInformation.zoneName}</Breadcrumb.Item>
                                                </Breadcrumb></Col>
                                            <Col xs={24} xl={8}>
                                                <Anchor affix={false} getCurrentAnchor={getCurrentAnchor}>
                                                    <Link href="#comments" title={saloonInformation.commentCount === 0 ? (<div>Henüz Yorum Yapılmamış</div>) : (<div>Yorum Sayısı: {saloonInformation.commentCount}</div>)} />
                                                </Anchor></Col>
                                        </Row>

                                        <Row style={{ marginTop: 15 }}>
                                            <Col className="ant-card-meta-description">{saloonInformation.shopDescription}</Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "10px" }}>
                                    <Col xs={24} xl={18} marginleft={10}>
                                        <Row >
                                            <Col xs={24} xl={4} style={{ float: "left" }}><b>Telefon Numarmız:</b></Col>
                                            <Col xs={24} xl={8} style={{ float: "left" }}>{saloonInformation.phoneNumber}</Col>
                                            {/* <Col aria-colspan="3" xs={24} xl={2} style={{ float: "left" }} className="ant-card-meta-title"></Col> */}

                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={4} style={{ float: "left" }}><b>Mobil Telefon:</b></Col>
                                            <Col xs={24} xl={8} style={{ float: "left" }}>{saloonInformation.mobilePhone} </Col>
                                        </Row>
                                        <Row xs={24} xl={24}>
                                            <Col xs={24} xl={4} style={{ float: "left" }}><b>Web Adresi:</b></Col>
                                            <Col xs={24} xl={8} style={{ float: "left" }}> <a href={saloonInformation.webSite}>{saloonInformation.webSite}</a> </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={4} style={{ float: "left" }}><b>Email Adresimiz:</b></Col>
                                            <Col xs={24} xl={8} style={{ float: "left" }}>{saloonInformation.email} </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={4} style={{ float: "left" }}><b>Adresimiz:</b></Col>
                                            <Col xs={24} xl={16} style={{ float: "left" }}>{saloonInformation.address} </Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </Card>
                        )}


                        {imagesLoading ? (
                            <div className="spinClass">
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                                <Skeleton.Image style={{ width: 200 }} active={true} />
                            </div>
                        ) : (
                            <Card title="Fotoğraflarımız"
                                hoverable
                                bordered={true}
                                style={cardStyle}
                                headStyle={headStyle}>

                                {
                                    modifiedCollection.map((row) =>
                                        <Row gutter={16} style={{ marginTop: 10 }}>
                                            {row.map(image => (
                                                <Col span={4} key={"col_img_" + image.id}>
                                                    <Image.PreviewGroup key={"preview-image-" + image.id}> <Image style={{ width: '100%', height: "140px" }}
                                                        key={"image-" + image.id} src={imageUrlDirectory + image.imageUrl} /></Image.PreviewGroup>
                                                </Col>))}
                                        </Row>
                                    )
                                }
                            </Card>
                        )}

                        {servicesLoading ? (
                            <div className="spinClass">
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                            </div>
                        ) : (
                            <Card title="Verdiğimiz Hizmetler"
                                hoverable
                                bordered={true}
                                style={cardStyle}
                                headStyle={headStyle}>
                                <List
                                    className="demo-loadmore-list"
                                    loading={loading}
                                    itemLayout="horizontal"
                                    // loadMore={loadMore}
                                    dataSource={saloonServices}
                                    renderItem={item => (
                                        <List.Item key={"ListItem_service_" + item.services.id}>
                                            <Skeleton key={"skeleton_service_" + item.services.id} avatar title={false} loading={loading} active>
                                                <List.Item.Meta key={"ListItem_Meta_Service_" + item.services.id}
                                                    description={item.services.serviceName}
                                                />
                                                <div>{item.price} TL</div>
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}


                        {personelsLoading ? (
                            <div className="spinClass">
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                            </div>
                        ) : (
                            <Card title="Personellerimiz"
                                hoverable
                                bordered={true}
                                style={cardStyle}
                                headStyle={headStyle}>
                                <List
                                    className="demo-loadmore-list"
                                    loading={loading}
                                    itemLayout="horizontal"
                                    // loadMore={loadMore}
                                    dataSource={saloonPersonels}
                                    renderItem={item => (
                                        <List.Item key={"listItem_Person_" + item.id}>
                                            <Skeleton key={"skeleton_person_" + item.id} avatar title={false} loading={loading} active>
                                                <List.Item.Meta key={"col_person_" + item.id}
                                                    description={item.personFullName}
                                                />
                                                <div>{item.isActive === true ? (<div>Aktif</div>) : (<div>Pasif</div>)}</div>
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}

                        <div id="comments">
                            {commentLoading ? (
                                <div className="spinClass">
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                </div>
                            ) : (
                                <Card title="Yorumlar"
                                    hoverable
                                    bordered={true}
                                    style={cardStyle}
                                    headStyle={headStyle}>
                                    {/* validateMessages={validateMessages} */}
                                    <Form {...layout} name="nest-messages" onFinish={onFinish} >
                                        <Form.Item
                                            wrapperCol={{ ...layout.wrapperCol }}
                                            name={'rate'}
                                            label="Puan"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Puan Alanı Boş Geçilemez"
                                                }
                                            ]}
                                        >
                                            <Rate allowHalf />
                                        </Form.Item>
                                        <Form.Item
                                            name={'header'}
                                            label="Başlık"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Başlık Alanı Boş Geçilemez"
                                                },
                                                { max: 150, message: "En Fazla 150 Karakter Uzunluğunda Olabilir" }
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name={'body'} label="Açıklama" rules={[
                                            {
                                                required: true,
                                                message: "Açıklama Alanı Boş Geçilemez"
                                            },
                                        ]}>
                                            <Input.TextArea rows={3} showCount maxLength={500} />
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                                            <Button type="primary" htmlType="submit">
                                                Paylaş
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <List
                                        size="large"
                                        style={{ backgroundColor: "white" }}
                                        footer={<Pagination defaultCurrent={page} defaultPageSize={pageSize} showTotal={showTotal} total={totalCount} onChange={onChange} />}
                                        bordered
                                        itemLayout="vertical"
                                        dataSource={comments}
                                        renderItem={item => (

                                            <List.Item key={"comment_" + item.id}
                                                // actions={[
                                                //     <Rate allowHalf value={item.rate}></Rate>
                                                // ]}
                                                extra={
                                                    <Rate allowHalf value={item.rate}></Rate>
                                                }
                                            >
                                                <List.Item.Meta
                                                    key={"comment_item_" + item.id}
                                                    title={item.userFullName}
                                                    description={item.commentHeader}
                                                />
                                                {item.commentBody} <br />
                                                {convertToFullDate(item.commentDate)}
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )}
                        </div>

                    </div>) : (<Alert
                        message="Hata!"
                        description="Üzgünüz. Aradığınız Salonu Bulamadık"
                        type="error"
                        closable
                        showIcon
                        style={{ marginTop: "3%", height: "100px" }}
                    />)}



                </Content>
                <MainFooter />
            </Layout >
        </div >
    );
};

export default SaloonPage;