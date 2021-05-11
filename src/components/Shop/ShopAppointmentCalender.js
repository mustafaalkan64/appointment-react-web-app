import React, { useState, useEffect, useContext } from "react";
import {
    Calendar, Badge, message, ConfigProvider,
} from 'antd';
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";

function ShopAppointmentCalender() {

    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem("auth_token");
    const history = useHistory();

    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

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
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge status='success' text={item.content} />
                    </li>
                ))}
            </ul>
        );
    }

    function getMonthData(value) {
        if (value.month() === 8) {
            return 1394;
        }
    }

    function monthCellRender(value) {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    }
    return (
        <div>
            <ConfigProvider locale={locale}>
                <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
            </ConfigProvider>
        </div>
    );
}

export default ShopAppointmentCalender;