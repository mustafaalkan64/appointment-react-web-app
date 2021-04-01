import React, { useEffect, useState, useCallback, useContext } from "react";
import { Table, Row, Col, Button, Typography, Input, Modal } from "antd";
import { useHistory } from "react-router";
import { Tag, Space, message, Spin, Select, notification } from "antd";
import API from "../../api";
import { serialize } from "../../utils";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
const { TextArea } = Input;

export default function MyAppointments(props) {
  const { Title } = Typography;
  const history = useHistory();
  const [myAppointments, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("");
  const status = props.status;
  const header = props.header;
  const { token } = useContext(UserContext);
  const appointmentHubUri = "https://localhost:5001/appointmentHub";
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [appointmentCancelReason, setAppointmentCancelReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connection, setConnection] = useState(null | HubConnection);

  useEffect(async () => {
    const connect = new HubConnectionBuilder()
      .withUrl(appointmentHubUri)
      .withAutomaticReconnect()
      .build();

    try {
      await connect.start();
    } catch (err) {
      console.log(err);
    }

    setConnection(connect);
  }, []);

  const sendMessage = async (appointmentId, cancel) => {
    if (connection.state == "Connected") {
      await connection.send("SendMessage", String(appointmentId), cancel);
    }
  };

  const showModel = (obj) => {
    setIsModalVisible(true);
    setSelectedAppointmentId(obj.id);
    setAppointmentCancelReason("");
  };

  const handleOk = () => {
    cancelAppointment(selectedAppointmentId, appointmentCancelReason);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const pageHeader = header;
  const { Option } = Select;

  const handleClick = () => {
    history.push("/form");
  };

  const handleSortChange = useCallback(
    (value) => {
      setSortValue(value);
    },
    [sortValue]
  );

  useEffect(() => {
    fetch({ pagination });
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Randevu Bilgilerim");
    setLastBreadcrumb(header);
  }, [sortValue, searchText]);

  const cancelAppointment = async (appointmentId, cancelReasonText) => {
    if (window.confirm("Randevuyu İptal Etmek İstediğinize Emin misiniz?")) {
      const cancelReason = {
        CancelReason: cancelReasonText,
      };
      await API.put(
        `appointment/cancelAppointment/${appointmentId}`,
        cancelReason,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          message.success(res.data.response);
          fetch({ pagination });
          sendMessage(appointmentId, cancelReasonText);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
            message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
          } else if (error.response.status === 404) {
            message.warning(error.response.data);
          } else {
            message.error(error.response.data);
          }
        });
    }
  };

  const convertToFullDate = (datetime) => {
    var d = new Date(datetime);
    var month = d.getUTCMonth() + 1; //months from 1-12
    var day = d.getDate();
    var year = d.getUTCFullYear();

    var minutes = d.getMinutes();
    var hour = d.getHours();

    var newdate = `${day}.${month}.${year} ${hour}:${minutes}`;
    return newdate;
  };

  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      pagination,
    });
  };

  const handleChangeSearch = (e) => {
    setSearchText(e.target.value);
    setPagination({
      current: 1,
      pageSize: 10,
    });
  };

  const fetch = async (params) => {
    setLoading(true);
    var filterAppointmentDto = serialize({
      Current: params.pagination.current,
      PageSize: params.pagination.pageSize,
      Status: status,
      SearchText: searchText,
      SortValue: sortValue,
    });
    await API.get(`appointment/filter?${filterAppointmentDto}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setAppointmentData(res.data.item1);
        setLoading(false);
        setPagination({
          ...params.pagination,
          total: res.data.item2,
        });
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 403) {
          message.error("Bu Sayfayı Görmeye Yetkili Değilsiniz!");
          return;
        }
        if (error.response.status === 401) {
          history.push("/login");
        } else {
          message.error("Randevuları Getirme Esnasında Hata ile Karşılaşıldı!");
          return;
        }
      });
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mağaza",
      dataIndex: "shopTitle",
      key: "shopTitle",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Randevu Başlangıç Tarihi",
      dataIndex: "appointmentBeginDate",
      key: "appointmentBeginDate",
      render: (date) => <a>{convertToFullDate(date)}</a>,
    },
    {
      title: "Randevu Bitiş Tarihi",
      dataIndex: "appointmentEndDate",
      key: "appointmentEndDate",
      render: (date) => <a>{convertToFullDate(date)}</a>,
    },
    {
      title: "Durumu",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <div>
          <Tag color={status === 1 ? "green" : "red"}>
            {status === 1 ? "Aktif" : "Pasif"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Randevu Aldığım Hizmetler",
      key: "appointmentServices",
      dataIndex: "appointmentServices",
      render: (appointmentServices) => (
        <div>
          {appointmentServices.map((service) => {
            let color =
              service.services.serviceName.length > 5 ? "geekblue" : "green";
            if (service.services.serviceName === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={service.services.id}>
                {service.services.serviceName.toUpperCase()}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Action",
      key: "id",

      render: (text, obj) => (
        <Space size="middle">
          <Button
            disabled={obj.status === 0}
            block
            type={obj.status === 1 ? "danger" : "primary"}
            onClick={() => showModel(obj)}
          >
            {obj.status === 1 ? "İptal Et" : "Aktif Et"}
          </Button>
        </Space>
      ),
    },
  ];

  myAppointments.map((data) => {
    data.shopTitle = data.shops.shopTitle;
    return data;
  });

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}>{pageHeader}</Title>
        </Col>
        <Col span={6}>
          <Button onClick={handleClick} block type="primary">
            Yeni Randevu Talep Et
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Input placeholder="Ara.." onChange={handleChangeSearch} />
        </Col>
        <Col span={12}>
          <Select
            defaultValue="Seçiniz"
            onChange={handleSortChange}
            style={{ width: "100%" }}
          >
            <Option key={"ascByCreatedDate"}>
              Oluşturulma Tarihine Göre Artan
            </Option>
            <Option key={"descByCreatedDate"}>
              Oluşturulma Tarihine Göre Azalan
            </Option>
            <Option key={"ascByAppointmentDate"}>
              En Yakın Tarihli Randevuya Göre
            </Option>
            <Option key={"descByAppointmentDate"}>
              En Uzak Tarihli Randevuya Göre
            </Option>
          </Select>
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={24}>
          {loading ? (
            <div className="spinClass">
              <Space size="middle">
                <Spin size="large" />
              </Space>
            </div>
          ) : (
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              pagination={pagination}
              loading={loading}
              onChange={handleTableChange}
              dataSource={myAppointments}
            />
          )}
        </Col>
      </Row>
      <Modal
        title="Randevu İptal"
        visible={isModalVisible}
        onOk={handleOk}
        okButtonProps={{
          disabled: appointmentCancelReason === "" ? true : false,
        }}
        onCancel={handleCancel}
      >
        <Row gutter={[40, 0]}>
          <Col span={24}>Randevu İptal Nedeni</Col>
        </Row>
        <Row gutter={[40, 0]}>
          <Col span={24}>
            <TextArea
              showCount
              value={appointmentCancelReason}
              onChange={(event) =>
                setAppointmentCancelReason(event.target.value)
              }
              maxLength={500}
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}
