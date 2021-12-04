import React, { useEffect, useState } from 'react';
import { Card, Layout, message, Row, Col, Image, Spin, Modal, Skeleton, Breadcrumb, Select, Anchor, Alert, Button } from 'antd';
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import {
    useParams
} from "react-router-dom";
import API from "../../api";
import { imageUrlDirectory } from "../../constUrls";
import { cardStyle, headStyle } from "../../assets/styles/styles";
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

const NewAppointment = () => {
    let { saloonId } = useParams();
    const [loading, setLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [personelsLoading, setPersonelsLoading] = useState(false);
    const [found, setFound] = useState(true);
    const { Option } = Select;
    // const history = useHistory();
    const token = localStorage.getItem("auth_token");
    const [logo, setLogo] = useState("");
    const [saloonInformation, setSaloonInformation] = useState({});
    const [saloonPersonels, setSaloonPersonels] = useState([]);
    const [saloonServices, setSaloonServices] = useState([]);
    const [appointmentCalenderList, setAppointmentCalenderList] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedSaloonPersonel, setSelectedSaloonPersonel] = useState(null);
    const [beginOfAppointmentDate, setBeginOfAppointmentDate] = useState(null);
    const [endOfAppointmentDate, setEndOfAppointmentDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [saveAppointmentLoading, setSaveAppointmentLoading] = useState(false);
    const [appointmentCalenderIsLoading, setAppointmentCalenderIsLoading] = useState(false);
    const [week, setWeek] = useState(0);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        var saveAppointmentModel = {
            BeginDate: beginOfAppointmentDate,
            EndDate: endOfAppointmentDate,
            ServicesId: selectedServices,
            SaloonPersonId: selectedSaloonPersonel,
            SaloonId: saloonId
        };

        if (selectedServices == null || selectedServices.length == 0) {
            setIsModalVisible(false);
            message.error("En Az Bir Hizmet Seçmelisiniz");
            return;
        }

        if (selectedSaloonPersonel == null || selectedSaloonPersonel == undefined) {
            setIsModalVisible(false);
            message.error("En Az Bir Personel Seçmelisiniz");
            return;
        }

        setIsModalVisible(false);
        setSaveAppointmentLoading(true);
        await API.post(`appointment/saveAppointment`, saveAppointmentModel, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                message.success("Randevunuz Kaydedildi!");
                await getWeeklyAppointments(week);
                setSaveAppointmentLoading(false);
            })
            .catch((error) => {
                if (error.response.status === 401 || error.response.status === 403) {
                    message.error("Randevu Almak İçin Kullanıcı Girişi Yapmanız Gerekmektedir!");
                } else {
                    message.error(error.response.data);
                }
                setSaveAppointmentLoading(false);
            });

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getWeeklyAppointments = async (week) => {
        setAppointmentCalenderIsLoading(true);
        await API.get(`appointment/getCurrentWeekAppointments?saloonId=${saloonId}&week=${week}`, {
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setAppointmentCalenderList(res.data);
                setAppointmentCalenderIsLoading(false);
                return true;
            })
            .catch((error) => {
                setAppointmentCalenderIsLoading(false);
                return false;
            });
    };

    useEffect(() => {

        const getSaloonDetail = async () => {
            setLoading(true);
            await API.get(`home/getSaloonProfile?saloonId=${saloonId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    setFound(true);
                    if (res.data == null || res.data == undefined || res.data == '')
                        setFound(false);
                    setSaloonInformation(res.data);
                    setLogo(imageUrlDirectory + res.data.logoUrl);
                    setLoading(false);
                    return true;
                })
                .catch((error) => {
                    if (error.response.status === 404) {
                        setFound(false);
                    } else {
                        message.error(error.response.data);
                    }
                    setLoading(false);
                    return false;
                });
        };

        const getCurrentWeekAppointments = async () => {
            await getWeeklyAppointments(0);
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
                    console.log(error.response.data);
                    setServicesLoading(false);
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
                    console.log(error.response.data);
                    setPersonelsLoading(false);
                });
        };

        getSaloonDetail();
        getSaloonServices();
        getSaloonPersonels();
        getCurrentWeekAppointments();

    }, [saloonId]);

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

    const showAppointmentModal = (beginDate, endDate, dayOfWeek) => {

        if (selectedServices == null || selectedServices.length == 0) {
            setIsModalVisible(false);
            message.error("En Az Bir Hizmet Seçmelisiniz");
            return;
        }

        if (selectedSaloonPersonel == null || selectedSaloonPersonel == undefined) {
            setIsModalVisible(false);
            message.error("En Az Bir Personel Seçmelisiniz");
            return;
        }

        setBeginOfAppointmentDate(beginDate);
        setEndOfAppointmentDate(endDate);
        setIsModalVisible(true);
        setModalContent(`${convertToFullDate(beginDate)} ${dayOfWeek} Günü ${getHourAndMinutes(beginDate)} ile  ${getHourAndMinutes(endDate)} Saatleri Arasında Randevu Almak İstediğinize Emin misiniz ?`);
    }

    const getPreviousWeekCalender = () => {
        let selectedWeek = week - 1;
        setWeek(selectedWeek);
        getWeeklyAppointments(selectedWeek);
    }

    const getNextWeekCalender = () => {
        let selectedWeek = week + 1;
        setWeek(selectedWeek);
        getWeeklyAppointments(selectedWeek);
    }

    return (
        <div>
            <Spin spinning={saveAppointmentLoading}>
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
                                                <Col xs={24} xl={8}></Col>
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
                                                </Col>
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


                            {servicesLoading ? (
                                <div className="spinClass">
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                </div>
                            ) : (
                                <Card
                                    title="Hizmet Seçimi"
                                    hoverable
                                    bordered={true}
                                    style={cardStyle}
                                    headStyle={headStyle}>
                                    <Row>
                                        <Col span={24}><Select
                                            placeholder="Aldığınız Hizmeti Seçiniz"
                                            defaultValue={[]}
                                            onChange={(key, items) => {
                                                setSelectedServices(items.map(x => x.key));
                                            }}
                                            mode="multiple"
                                            style={{ width: "100%" }}
                                        >
                                            {saloonServices.map((element) => (
                                                <Option key={element.services.id} value={element.services.serviceName}>
                                                    {element.services.serviceName}
                                                </Option>
                                            ))}
                                        </Select></Col>
                                    </Row>
                                </Card>
                            )}


                            {personelsLoading ? (
                                <div className="spinClass">
                                    <Skeleton active />
                                    <Skeleton active />
                                    <Skeleton active />
                                </div>
                            ) : (
                                <Card title="Personel Seçimi"
                                    hoverable
                                    bordered={true}
                                    style={cardStyle}
                                    headStyle={headStyle}>
                                    <Row>
                                        <Col span={24}><Select
                                            onChange={(value, item) => {
                                                setSelectedSaloonPersonel(item.key);
                                            }}
                                            placeholder="Personel Seçiniz"
                                            defaultValue={[]}
                                            style={{ width: "100%" }}
                                        >
                                            <Option key={0} value={0}>Farketmez</Option>
                                            {saloonPersonels.map((element, index) => (
                                                <Option key={element.id} value={element.personFullName}>
                                                    {element.personFullName}
                                                </Option>
                                            ))}
                                        </Select></Col>
                                    </Row>
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


                        {appointmentCalenderIsLoading ? (
                            <div className="spinClass">
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                            </div>
                        ) : (
                            <Card title="Randevu Saati Seçimi"
                                hoverable
                                bordered={true}
                                style={cardStyle}
                                headStyle={headStyle}>
                                {appointmentCalenderList.map((appointmentCalender) => (
                                    <Row>
                                        <Col flex="150px">{convertToFullDate(appointmentCalender.appointmentDate)} {appointmentCalender.dayOfWeek}</Col>
                                        <Col flex="auto">
                                            <Row>
                                                {
                                                    appointmentCalender.appointmentHoursList.map((appointmentHour) => (
                                                        <Col><Button onClick={() => showAppointmentModal(appointmentHour.startDate, appointmentHour.endDate, appointmentCalender.dayOfWeek)} disabled={!appointmentHour.isActive}>{getHourAndMinutes(appointmentHour.startDate)}</Button></Col>
                                                    ))
                                                }
                                            </Row>
                                        </Col>
                                    </Row>
                                ))}
                                <Row>
                                    <Col span={12} offset={10}>
                                        <Button type="primary" onClick={() => getPreviousWeekCalender()} style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}>Önceki Hafta</Button>
                                        <Button type="primary" onClick={() => getNextWeekCalender()}>Sonraki Hafta</Button>
                                    </Col>
                                </Row>

                            </Card>)}

                        <Modal title="Randevu Onayı" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>{modalContent}</p>
                        </Modal>

                    </Content>
                    <MainFooter />
                </Layout >
            </Spin>
        </div >
    );
};

export default NewAppointment;