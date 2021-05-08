import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { List, Pagination, message, Skeleton } from "antd";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";

const ShopNotifications = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const [totalCount, setTotalCount] = useState([]);
    const history = useHistory();
    const token = localStorage.getItem("auth_token");
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);


    function onChange(pageNumber) {
        setLoading(true);
        setPage(pageNumber);
        API.get(`notifications/getNotifications/${pageSize}/${pageNumber}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setData(res.data.item1.map((item, i) => item.notificationText));
                setTotalCount(res.data.item2);
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
    }

    function showTotal(total) {
        return `Total ${total} items`;
    }


    useEffect(() => {
        const getShopNotifications = async () => {
            setLoading(true);
            await API.get(`notifications/getNotifications/${pageSize}/${page}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    setData(res.data.item1.map((item, i) => item.notificationText));
                    setTotalCount(res.data.item2);
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
        setLastBreadcrumb, history, page, token
    ]);

    return (
        <div>
            {loading ? (
                <div className="spinClass">
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>
            ) : (
                <List
                    size="large"
                    style={{ backgroundColor: "white", width: "100%" }}
                    header={<div><h3>Bildirimlerim</h3></div>}
                    footer={<Pagination defaultCurrent={page} defaultPageSize={pageSize} showTotal={showTotal} total={totalCount} onChange={onChange} />}
                    bordered
                    dataSource={data}
                    renderItem={item => <List.Item>{item}</List.Item>}
                />
            )}

        </div>
    );
};

export default ShopNotifications;