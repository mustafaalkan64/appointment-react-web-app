import React, { useEffect, useState } from 'react';
import { Card, Layout, message, Row, Col, Image, Rate, List, Skeleton, Breadcrumb, Pagination, Anchor } from 'antd';
import MainHeader from "./MainHeader";
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

const { Content, Footer } = Layout;
const validateMessages = {
    required: '${label} Alanı Zorunludur!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

const SaloonPage = () => {
    let { saloonUrl } = useParams();
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    // const history = useHistory();
    const token = localStorage.getItem("auth_token");
    const [logo, setLogo] = useState("");
    const [saloonId, setSaloonId] = useState(null);
    const [saloonInformation, setSaloonInformation] = useState({});
    const [comments, setComments] = useState([]);
    const [rate, setRate] = useState(5);
    const [modifiedCollection, setModifiedCollection] = useState([]);
    const getCurrentAnchor = () => '#components-anchor-demo-static';
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalCount, setTotalCount] = useState([]);

    function onChange(pageNumber) {
        setCommentLoading(true);
        setPage(pageNumber);
        API.get(`shop/getComments/${saloonId}/${pageSize}/${pageNumber}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setComments(res.data.item1.map((item, i) => item.notificationText));
                setTotalCount(res.data.item2);
                setCommentLoading(false);
            })
            .catch((error) => {
                message.error(error.response.data);
                setCommentLoading(false);
            });
    }

    function showTotal(total) {
        return `Total ${total} items`;
    }

    const onFinish = async (values) => {
        console.log(values);
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
                message.success("Yorumunuz Kaydedildi. Onay İçin Beklemektedir!");
                setCommentLoading(false);
            })
            .catch((error) => {
                debugger;
                if (error.response.status === 401) {
                    message.error("Yorum Yapabilmeniz İçin Kullanıcı Girişi Yapmanız Gerekmektedir!");
                } else {
                    message.error(error.response.data);
                }
                setCommentLoading(false);
            });

    };


    useEffect(async () => {
        let saloonId = 0;
        const getShopDetail = async () => {
            setLoading(true);
            await API.get(`shop/getSaloonDetails?saloonTitle=${saloonUrl}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setSaloonId(res.data.id);
                    saloonId = res.data.id; //local saloonId
                    setSaloonInformation(res.data);
                    setLogo(imageUrlDirectory + res.data.logoUrl);
                    setLoading(false);
                    if (res.data.shopImages.length > 0) {
                        let modifiedCollections = res.data.shopImages.reduce((rows, key, index) => {
                            return (index % 6 === 0 ? rows.push([key])
                                : rows[rows.length - 1].push(key)) && rows;
                        }, []);
                        setModifiedCollection(modifiedCollections);
                    }
                })
                .catch((error) => {
                    debugger;
                    message.error(error.response.data);
                    setLoading(false);
                });
        };

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
                    message.error(error.response.data);
                    setCommentLoading(false);
                });
        }

        const getCommentsRateAverage = async () => {

            await API.get(`comments/getCommentsRateAverage/${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setRate(res.data);
                })
                .catch((error) => {
                    message.error(error.response.data);
                });
        }
        await getShopDetail();
        await getComments();
        await getCommentsRateAverage();
    }, [

    ]);

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
            <Layout>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 50px', marginTop: 10, marginLeft: '10%' }}>

                    <div className="site-layout-content">
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
                                    <Col xs={24} xl={18} marginTop={10} marginLeft={10}>
                                        <Row >
                                            <Col xs={24} xl={16} style={{ float: "left" }} className="ant-card-meta-title">{saloonInformation.shopTitle}</Col>
                                            <Col xs={24} xl={8}><Rate allowHalf defaultValue={rate} /></Col>
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
                                                    <Link href="#comments" title={comments.length == 0 ? (<div>Henüz Yorum Yapılmamış</div>) : (<div>Yorum Sayısı: {comments.length}</div>)} />
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
                                    <Col xs={24} xl={18} marginLeft={10}>
                                        <Row >
                                            <Col xs={24} xl={16} style={{ float: "left" }}><b>Telefon Numarmız:</b> {saloonInformation.phoneNumber}</Col>
                                            <Col aria-colspan="3" xs={24} xl={2} style={{ float: "left" }} className="ant-card-meta-title"></Col>

                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={16} style={{ float: "left" }}><b>Mobil Telefon:</b> {saloonInformation.mobilePhone}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={16} style={{ float: "left" }}><b>Web Adresi:</b> <a href={saloonInformation.webSite}>{saloonInformation.webSite}</a> </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={16} style={{ float: "left" }}><b>Email:</b> {saloonInformation.email}</Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} xl={16} style={{ float: "left" }}><b>Adres:</b> {saloonInformation.address}</Col>
                                        </Row>

                                    </Col>
                                </Row>
                            </Card>
                        )}


                        {loading ? (
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
                                                <Col span={4}>
                                                    <Image.PreviewGroup key={"preview-image-" + image.id}> <Image style={{ width: '100%', height: "140px" }}
                                                        key={"image-" + image.id} src={imageUrlDirectory + image.imageUrl} /></Image.PreviewGroup>
                                                </Col>))}
                                        </Row>
                                    )
                                }
                            </Card>
                        )}

                        {loading ? (
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
                                    dataSource={saloonInformation.shopServices}
                                    renderItem={item => (
                                        <List.Item>
                                            <Skeleton avatar title={false} loading={loading} active>
                                                <List.Item.Meta
                                                    description={item.services.serviceName}
                                                />
                                                <div>{item.price}</div>
                                            </Skeleton>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}


                        {loading ? (
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
                                    dataSource={saloonInformation.saloonPersonels}
                                    renderItem={item => (
                                        <List.Item>
                                            <Skeleton avatar title={false} loading={loading} active>
                                                <List.Item.Meta
                                                    description={item.personFullName}
                                                />
                                                <div>{item.isActive == true ? (<div>Aktif</div>) : (<div>Pasif</div>)}</div>
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
                                    <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                                        <Form.Item
                                            wrapperCol={{ ...layout.wrapperCol, offset: 2 }}
                                            name={'rate'}
                                        >
                                            <Rate allowHalf />
                                        </Form.Item>
                                        <Form.Item
                                            name={'header'}
                                            label="Başlık"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name={'body'} label="Açıklama" rules={[
                                            {
                                                required: true,
                                            },
                                        ]}>
                                            <Input.TextArea />
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                                            <Button type="primary" htmlType="submit">
                                                Paylaş
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                    <List
                                        size="large"
                                        style={{ backgroundColor: "white", width: "100%" }}
                                        footer={<Pagination defaultCurrent={page} defaultPageSize={pageSize} showTotal={showTotal} total={totalCount} onChange={onChange} />}
                                        bordered
                                        dataSource={comments}
                                        renderItem={item => (

                                            <List.Item key={item.id} actions={[
                                                <Rate allowHalf value={item.rate}></Rate>
                                            ]}
                                            >
                                                <List.Item.Meta
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

                    </div>


                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        </div >
    );
};

export default SaloonPage;