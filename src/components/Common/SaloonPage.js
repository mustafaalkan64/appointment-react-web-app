import React, { useEffect, useState } from 'react';
import { Card, Layout, message, Row, Col, Image, Rate, List, Skeleton } from 'antd';
import MainHeader from "./MainHeader";
import {
    useParams
} from "react-router-dom";
import API from "../../api";
import { useHistory } from "react-router";
import { imageUrlDirectory } from "../../constUrls";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { render } from '@testing-library/react';

const { Content, Footer } = Layout;

const SaloonPage = () => {
    let { saloonUrl } = useParams();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [logo, setLogo] = useState("");
    const [shopId, setShopId] = useState(null);
    const [saloonInformation, setSaloonInformation] = useState({});
    const [rate, setRate] = useState(5);
    const [modifiedCollection, setModifiedCollection] = useState([]);

    useEffect(() => {
        debugger;
        const getShopDetail = () => {
            setLoading(true);
            API.get(`shop/getSaloonDetails?saloonTitle=${saloonUrl}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    debugger;
                    setShopId(res.data.id);
                    setSaloonInformation(res.data);
                    setLogo(imageUrlDirectory + res.data.logoUrl);
                    setRate(res.data.averagePoint);
                    setLoading(false);
                })
                .catch((error) => {
                    debugger;
                    message.error(error.response.data);
                    setLoading(false);
                });
        };
        getShopDetail();
    }, [
        saloonUrl,
    ]);

    return (
        <div>
            <Layout>
                <MainHeader></MainHeader>
                <Content style={{ padding: '0 50px', marginTop: 10, marginLeft: '10%' }}>

                    <div className="site-layout-content">
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
                                        <Col xs={24} xl={16} style={{ float: "left" }} className="ant-card-meta-title"></Col>
                                        <Col xs={24} xl={8}>{saloonInformation.commentCount == 0 ? (<div>Henüz Yorum Yapılmamış</div>) : (<div>Yorum Sayısı: {saloonInformation.commentCount}</div>)}</Col>
                                    </Row>

                                    <Row style={{ marginTop: 15 }}>
                                        <Col className="ant-card-meta-description">{saloonInformation.shopDescription}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Fotoğraflarımız"
                            hoverable
                            bordered={true}
                            style={cardStyle}
                            headStyle={headStyle}>

                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={saloonInformation.shopImages}
                                renderItem={image => (
                                    <List.Item>
                                        <Card><Image.PreviewGroup key={"preview-image-" + image.id}> <Image style={{ width: "100%", height: "140px" }} key={"image-" + image.id} src={imageUrlDirectory + image.imageUrl} /></Image.PreviewGroup></Card>
                                    </List.Item>
                                )}
                            />
                        </Card>
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
                    </div>

                </Content>
                <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout >
        </div>
    );
};

export default SaloonPage;