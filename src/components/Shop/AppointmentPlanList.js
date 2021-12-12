import React, { useState, useEffect, useContext, useCallback } from "react";
import { List, message, Row, Col, Card, Skeleton, Button } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { Link } from "react-router-dom";

const AppointmentPlanList = () => {
    const history = useHistory();
    const [appoinmentPlans, setAppointmentPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("auth_token");
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    const redirectToNewAppointmentPlan = () => {
        history.push("saveAppointmentPlan/0")
    }

    const activateOrPassiveAppointmentPlan = async (id) => {
        setLoading(true);
        await API.put(`shop/activateOrPassiveAppoinmentPlan?id=${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setLoading(false);
                getAppointmentPlanList();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    history.push("/login");
                } else {
                    message.error(error.response.data.message);
                }
                setLoading(false);
            });
    }

    const getAppointmentPlanList = useCallback(async () => {
        setLoading(true);
        await API.get(`shop/getAppointmentPlanList`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setAppointmentPlans(res.data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    history.push("/login");
                } else {
                    message.error(error.response.data.message);
                }
                setLoading(false);
            });
    }, [history, token]);

    useEffect(() => {
        getAppointmentPlanList();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Profil");
        setLastBreadcrumb("Randevu Planları");
    }, [
        history,
        setFirstBreadcrumb,
        setLastBreadcrumb,
        setSecondBreadcrumb,
        token,
        getAppointmentPlanList
    ]);

    return (
        <div>
            <Row>
                <Col span={23} offset={1}>
                    <Button type="primary" onClick={() => redirectToNewAppointmentPlan()} style={{ marginBottom: 10 }}>Yeni Randevu Planı Ekle</Button>
                    <Card
                        title="Randevu Planlarım"
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}
                    >
                        <List
                            // className="demo-loadmore-list"
                            loading={loading}
                            itemLayout="horizontal"
                            dataSource={appoinmentPlans}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Link to={`saveAppointmentPlan/${item.id}`}>Düzenle</Link>, item.isActive ? (<Button type="danger" onClick={() => activateOrPassiveAppointmentPlan(item.id)}>Pasif Et</Button>) : (<Button onClick={() => activateOrPassiveAppointmentPlan(item.id)} type="primary">Aktif Et</Button>)]}
                                >
                                    <Skeleton avatar title={false} loading={loading} active>
                                        <List.Item.Meta
                                            title={item.name}
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

export default AppointmentPlanList;
