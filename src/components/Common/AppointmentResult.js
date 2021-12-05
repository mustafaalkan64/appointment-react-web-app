import React, { useEffect, useState } from 'react';
import { Card, Layout, Spin, Skeleton, Result, Anchor, Alert, Button } from 'antd';
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import {
    useParams
} from "react-router-dom";
import API from "../../api";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { useHistory } from "react-router";
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

const AppointmentResult = () => {
    const history = useHistory();
    let { appointmentId } = useParams();
    const [loading, setLoading] = useState(false);
    const [found, setFound] = useState(true);
    const [appointmentResult, setAppointmentResult] = useState({});
    // const history = useHistory();
    const token = localStorage.getItem("auth_token");

    useEffect(() => {
        const getAppointmentResult = () => {
            var retrievedAppointment = JSON.parse(localStorage.getItem('appointmentResult'));
            setAppointmentResult(retrievedAppointment);
        }
        getAppointmentResult();

    }, [appointmentId]);

    const convertToFullDate = (datetime) => {
        var d = new Date(datetime);
        var month = d.getUTCMonth() + 1; //months from 1-12
        var day = d.getDate();
        var year = d.getUTCFullYear();

        var newdate = `${("0" + day).slice(-2)}.${("0" + month).slice(-2)}.${year}`;
        return newdate;
    };

    const getHourAndMinutes = (datetime) => {
        var d = new Date(datetime);
        var minutes = d.getMinutes();
        var hour = d.getHours();

        var newdate = `${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}`;
        return newdate;
    };

    return (
        <div>
            <Spin spinning={loading}>
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
                                    <Result
                                        status="success"
                                        title={`Randevunuz Başarıyla Tamamlandı!`}
                                        subTitle={`${convertToFullDate(appointmentResult.BeginDate)} Tarihinde ${getHourAndMinutes(appointmentResult.BeginDate)} ile ${getHourAndMinutes(appointmentResult.EndDate)} Tarihleri Arasında Randevu Oluşturdunuz`}
                                        extra={[
                                            <Button type="primary" onClick={() => history.push("/myActiveAppointments")} key="console">
                                                Randevularım
                                            </Button>,
                                            <Button key="buy">Tekrar Randevu Al</Button>,
                                        ]}
                                    />
                                </Card>
                            )}



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
            </Spin>
        </div >
    );
};

export default AppointmentResult;