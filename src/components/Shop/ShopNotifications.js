import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { List, Pagination, message, Skeleton } from "antd";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";

const ShopNotifications = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const history = useHistory();
    const token = localStorage.getItem("auth_token");
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    useEffect(() => {
        const getShopNotifications = async () => {
            setLoading(true);
            const pageSize = 5;
            const page = 1
            await API.get(`notifications/getNotifications/${pageSize}/${page}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setData(res.data.map((item, i) => item.notificationText));
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
        getShopNotifications();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Profilim");
        setLastBreadcrumb("Bildirimler");
    }, [
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    ]);

    return (
        <div>
            {loading ? (
                <div className="spinClass">
                    <Skeleton active />
                </div>
            ) : (
                <List
                    size="large"
                    style={{ backgroundColor: "white", width: "100%" }}
                    header={<div><h3>Bildirimlerim</h3></div>}
                    footer={<Pagination defaultCurrent={1} total={50} />}
                    bordered
                    dataSource={data}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            )}

        </div>
    );
};

export default ShopNotifications;