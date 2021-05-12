import React, { useState, useEffect, useContext } from "react";
import {
    Calendar, Badge, message, ConfigProvider, Alert, Modal
} from 'antd';
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
import moment from 'moment';

function ShopAppointmentCalender() {

    const [appointments, setAppointments] = useState([]);
    const [dailyAppointments, setDailyAppointments] = useState([]);
    const token = localStorage.getItem("auth_token");
    const [value, setValue] = useState(moment());
    const [selectedValue, setSelectedValue] = useState(moment());
    const history = useHistory();
    const [isModalVisible, setIsModalVisible] = useState(false);


    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    function onSelect(value) {
        setValue(value);
        showModal(value);
        setSelectedValue(value);
    };

    function onPanelChange(value) {
        setValue(value);
    };

    const showModal = (value) => {
        var date = parseInt(value.format('D'));
        var month = parseInt(value.format('M'));
        var year = parseInt(value.format('YYYY'));
        let dailyAppointments = appointments.filter((x) => parseInt(x.startDate.substr(0, 4)) === year && parseInt(x.startDate.substr(5, 2)) === month && parseInt(x.startDate.substr(8, 2)) === date);
        setDailyAppointments(dailyAppointments);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {

        const getAppointmentsByShopId = async () => {
            await API.get(`appointment/getAppointmentsByShopId`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setAppointments(res.data);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        history.push("/login");
                    } else {
                        message.error(error.response.data);
                    }
                });
        };

        getAppointmentsByShopId();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Randevular");
        setLastBreadcrumb("Takvim");
    }, [
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
        setAppointments,
        token,
        history
    ]);

    function getListData(value) {
        let listData;
        var date = parseInt(value.format('D'));
        var month = parseInt(value.format('M'));
        var year = parseInt(value.format('YYYY'));
        listData = appointments.filter((a) => parseInt(a.startDate.substr(0, 4)) === year && parseInt(a.startDate.substr(5, 2)) === month && parseInt(a.startDate.substr(8, 2)) === date);
        return listData || [];
    }

    function dateCellRender(value) {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map((item, key) => (
                    <li key={key}>
                        <Badge status='success' text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    function getMonthData(value) {
        var data = appointments.filter((a) => parseInt(a.startDate.substr(0, 4)) === value.year() && parseInt(a.startDate.substr(5, 2)) === value.month());
        return data.length;
    }

    function monthCellRender(value) {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Randevu</span>
            </div>
        ) : null;
    }
    return (
        <div>
            <ConfigProvider locale={locale}>
                <Alert
                    message={`Seçtiğiniz Tarih: ${selectedValue && selectedValue.format('DD.MM.YYYY')}`}
                />
                <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </ConfigProvider>

            <Modal title="Randevularınız" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                {dailyAppointments.map((item, key) => (
                    <p key={key}>{item.content}</p>
                ))}
            </Modal>
        </div>
    );
}

export default ShopAppointmentCalender;