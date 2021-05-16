import React, { useState, useEffect, useContext, useCallback } from "react";
import { List, message, Row, Col, Card, Skeleton, Avatar, Button } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { Link } from "react-router-dom";

const SaloonPersonels = () => {
    const history = useHistory();
    const [saloonPersons, setSaloonPersons] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("auth_token");
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    const removePerson = (value) => {
        console.log(value);
    }

    const activateOrPassivePerson = async (value) => {
        setLoading(true);
        await API.put(`shop/activateOrPassiveSaloonPersonel?personId=${value}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setLoading(false);
                getSaloonPersonels();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    history.push("/login");
                } else {
                    message.error(error.response.data);
                }
                setLoading(false);
            });
    }

    const pushToCreateNewPersonPage = () => {
        history.push("savePersonel/0")
    }

    const getSaloonPersonels = useCallback(async () => {
        setLoading(true);
        await API.get(`shop/getSaloonPersonels`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setSaloonPersons(res.data);
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
    }, []);

    useEffect(() => {
        getSaloonPersonels();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Profil");
        setLastBreadcrumb("Personel Bilgileri");
    }, [
        history,
        setFirstBreadcrumb,
        setLastBreadcrumb,
        setSecondBreadcrumb,
        token,
    ]);

    return (
        <div>
            <Row>
                <Col span={20} offset={2}>
                    <Button type="primary" onClick={() => pushToCreateNewPersonPage()} style={{ marginBottom: 10 }}>Yeni Personel Ekle</Button>
                    <Card
                        title="Personellerim"
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}
                    >
                        <List
                            className="demo-loadmore-list"
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={saloonPersons}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Link to={`savePersonel/${item.id}`}>Düzenle</Link>,
                                    <Button type="danger" onClick={() => removePerson(item.id)}>Kaldır</Button>,
                                    item.isActive ? (<Button type="danger" onClick={() => activateOrPassivePerson(item.id)}>Pasif Et</Button>) : (<Button onClick={() => activateOrPassivePerson(item.id)} type="primary">Aktif Et</Button>)]}
                                >
                                    <Skeleton avatar title={false} loading={loading} active>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                            }
                                            title={item.personFullName}
                                        />
                                    </Skeleton>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row >
        </div >
    );
};

export default SaloonPersonels;
