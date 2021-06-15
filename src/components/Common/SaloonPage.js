import React, { useEffect, useState } from 'react';
import { Card, Layout, message, Row, Col, Image, Rate, List, Skeleton, Breadcrumb, Pagination, Anchor } from 'antd';
import MainHeader from "./MainHeader";
import {
    useParams
} from "react-router-dom";
import API from "../../api";
import { useHistory } from "react-router";
import { imageUrlDirectory } from "../../constUrls";
import { cardStyle, headStyle } from "../../assets/styles/styles";

const { Link } = Anchor;

const { Content, Footer } = Layout;

const SaloonPage = () => {
    let { saloonUrl } = useParams();
    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    // const history = useHistory();
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
                    saloonId = res.data.id;
                    setSaloonInformation(res.data);
                    setLogo(imageUrlDirectory + res.data.logoUrl);
                    setRate(res.data.averagePoint);
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
        await getShopDetail();
        await getComments();
    }, [

    ]);

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
                                            <Col xs={24} xl={8}><Rate allowHalf defaultValue={4.5} /></Col>
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
                                                    <Link href="#comments" title={saloonInformation.commentCount == 0 ? (<div>Henüz Yorum Yapılmamış</div>) : (<div>Yorum Sayısı: {saloonInformation.commentCount}</div>)} />
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
                                    <List
                                        size="large"
                                        style={{ backgroundColor: "white", width: "100%" }}
                                        footer={<Pagination defaultCurrent={page} defaultPageSize={pageSize} showTotal={showTotal} total={totalCount} onChange={onChange} />}
                                        bordered
                                        dataSource={comments}
                                        renderItem={item => <List.Item>{item}</List.Item>}
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