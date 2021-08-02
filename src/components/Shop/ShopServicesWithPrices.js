import React, { useState, useEffect, useContext } from "react";
import { TreeSelect, message, Row, Button, Col, Spin, Card } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { Table, Space } from 'antd';
const { Column } = Table;

const ShopServicesWithPrices = () => {
    const history = useHistory();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const token = localStorage.getItem("auth_token");
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    useEffect(() => {
        const getServices = async () => {
            setLoading(true);
            await API.get(`services/getServicesByShopId`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    debugger;
                    setServices(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        history.push("/login");
                    } else {
                        message.error(error.response.data);
                    }
                    setLoading(false);
                });
        };

        getServices();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Ayarlar");
        setLastBreadcrumb("Fiyatlar");
    }, [
        history,
        setFirstBreadcrumb,
        setLastBreadcrumb,
        setSecondBreadcrumb,
        token,
    ]);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'shopServiceId',
            key: 'shopServiceId',
        },
        {
            title: 'Hizmet',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: 'Fiyat',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Min Fiyat',
            dataIndex: 'minPrice',
            key: 'minPrice',
        },
        {
            title: 'Max Fiyat',
            dataIndex: 'maxPrice',
            key: 'maxPrice',

        },
    ];

    return (
        <div>
            <Row>
                <Col span={20} offset={2}>
                    <Card
                        title="Hizmet Fiyatları"
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}
                    >
                        <Spin spinning={loading} delay={500}>
                            <Table dataSource={services} columns={columns} />
                            {/* <Column title="Id" dataIndex="shopServiceId" key="shopServiceId" />
                            <Column title="Hizmet" dataIndex="serviceName" key="serviceName" />
                            <Column title="Min Fiyat" dataIndex="minPrice" key="minPrice" />
                            <Column title="Max Fiyat" dataIndex="maxPrice" key="maxPrice" />
                            <Column title="Fiyat" dataIndex="price" key="price" />
                            <Column
                                title="Action"
                                key="action"
                                render={(text, record) => (
                                    <Space size="middle">
                                        <a>Kaydet</a>
                                    </Space>
                                )} */}
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShopServicesWithPrices;