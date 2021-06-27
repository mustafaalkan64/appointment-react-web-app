import React, { useState, useEffect, useContext } from "react";
import { List, Pagination, message, Skeleton, Rate, Card, Button } from "antd";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";


const Comments = () => {

    const token = localStorage.getItem("auth_token");
    const [comments, setComments] = useState([]);
    const pageSize = 5;
    const [totalCount, setTotalCount] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);


    const onChange = (pageNumber) => {
        setLoading(true);
        setPage(pageNumber);
        API.get(`comments/getUnApprovedComments/${pageSize}/${pageNumber}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setComments(res.data.item1.map((item, i) => item));
                setTotalCount(res.data.item2);
                setLoading(false);
            })
            .catch((error) => {
                message.error(error.response.data);
                setLoading(false);
            });
    }

    function showTotal(total) {
        return `Toplam ${total} Yorum`;
    }

    const getComments = async () => {
        setLoading(true);
        const pageNumber = 1;
        setPage(pageNumber);
        await API.get(`comments/getUnApprovedComments/${pageSize}/${pageNumber}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                setComments(res.data.item1.map((item, i) => item));
                setTotalCount(res.data.item2);
                setLoading(false);
            })
            .catch((error) => {
                debugger;
                message.error(error.response.data);
                setLoading(false);
            });
    }

    useEffect(() => {
        // const getComments = async () => {
        //     setLoading(true);
        //     const pageNumber = 1;
        //     setPage(pageNumber);
        //     await API.get(`comments/getUnApprovedComments/${pageSize}/${pageNumber}`, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`,
        //         },
        //     })
        //         .then((res) => {
        //             setComments(res.data.item1.map((item, i) => item));
        //             setTotalCount(res.data.item2);
        //             setLoading(false);
        //         })
        //         .catch((error) => {
        //             debugger;
        //             message.error(error.response.data);
        //             setLoading(false);
        //         });
        // }
        getComments();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Yorumlar");
        setLastBreadcrumb("");
    }, [
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
        token,
        setTotalCount,
        setComments
    ]);


    const convertToFullDate = (datetime) => {
        var d = new Date(datetime);
        var month = d.getUTCMonth() + 1; //months from 1-12
        var day = d.getDate();
        var year = d.getUTCFullYear();

        var minutes = d.getMinutes();
        var hour = d.getHours();

        var newdate = `${("0" + day).slice(-2)}.${("0" + month).slice(-2)}.${year} ${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}`;
        return newdate;
    };

    const approveComment = async (id) => {
        setLoading(true);
        await API.put(`comments/updateCommentsAsApproved?commentId=${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                message.success(res.data.response);
                getComments();
                setLoading(false);
            })
            .catch((error) => {
                message.error(error.response.data);
                setLoading(false);
            });
    }


    const removeComment = async (id) => {
        setLoading(true);
        await API.delete(`comments/removeComment?commentId=${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                getComments();
                message.success(res.data.response);
                setLoading(false);
            })
            .catch((error) => {
                message.error(error.response.data);
                setLoading(false);
            });
    }

    return (
        <div id="comments">
            {loading ? (
                <div className="spinClass">
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>
            ) : (
                <Card title="Yorumlar"
                    hoverable
                    bordered={true}
                    style={cardStyle}
                    headStyle={headStyle}>
                    <List
                        size="large"
                        style={{ backgroundColor: "white" }}
                        footer={<Pagination defaultCurrent={page} defaultPageSize={pageSize} showTotal={showTotal} total={totalCount} onChange={onChange} />}
                        bordered
                        itemLayout="vertical"
                        dataSource={comments}
                        renderItem={item => (

                            <List.Item key={"comment_" + item.id}
                                actions={[
                                    <Button onClick={() => approveComment(item.id)} type="primary">Onayla</Button>,
                                    <Button onClick={() => removeComment(item.id)} type="danger">Sil</Button>]}
                                extra={
                                    <Rate allowHalf value={item.rate}></Rate>
                                }
                            >
                                <List.Item.Meta
                                    key={"comment_item_" + item.id}
                                    title={item.userFullName}
                                    description={item.commentHeader}
                                />
                                {item.commentBody} <br />
                                {convertToFullDate(item.commentDate)}
                            </List.Item>
                        )}
                    />
                </Card>
            )}
        </div>

    );
};

export default Comments;