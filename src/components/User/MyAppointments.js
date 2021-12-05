import React, { useEffect, useState, useCallback, useContext } from "react";
import { Table, Row, Col, Button, Typography, Input, Modal } from "antd";
import { useHistory } from "react-router";
import { Tag, Space, message, Skeleton, Select } from "antd";
import API from "../../api";
import { appointmentHub } from "../../constUrls";
import { serialize } from "../../utils";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
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
  const [selectedShopId, setSelectedShopId] = useState(0);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // useEffect(() => {
  //   const connect = new HubConnectionBuilder()
  //     .withUrl(appointmentHub)
  //     .withAutomaticReconnect()
  //     .build();

  //   try {
  //     connect.start();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  const showModel = (obj) => {
    setIsModalVisible(true);
    setSelectedAppointmentId(obj.id);
    setSelectedShopId(obj.shopId);
    setAppointmentCancelReason("");
  };

  const handleOk = () => {
    cancelAppointment(
      selectedAppointmentId,
      appointmentCancelReason,
      selectedShopId
    );
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const pageHeader = header;
  const { Option } = Select;

  const handleSortChange = useCallback((value) => {
    setSortValue(value);
  }, []);

  useEffect(() => {
    fetch({ pagination });
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Randevu Bilgilerim");
    setLastBreadcrumb(header);
  }, [
    searchText,
    sortValue,
    setFirstBreadcrumb,
    setLastBreadcrumb,
    setSecondBreadcrumb,
    header,
    //pagination,
  ]);

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
          message.error(error.response.data.message);
          return;
        }
      });
  };

  const cancelAppointment = async (appointmentId, cancelReasonText, shopId) => {
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
          //sendMessage(appointmentId, cancelReasonText, shopId);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
            message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
          } else {
            message.error(error.response.data.message);
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

    var newdate = `${("0" + day).slice(-2)}.${("0" + month).slice(-2)}.${year} ${("0" + hour).slice(-2)}:${("0" + minutes).slice(-2)}`;
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

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      responsive: ["xs"]
    },
    {
      title: "Mağaza",
      dataIndex: "shopTitle",
      key: "shopTitle",
      render: (text) => <p>{text}</p>,
      responsive: ["sm"]
    },
    {
      title: "Randevu Başlangıç Tarihi",
      dataIndex: "appointmentBeginDate",
      key: "appointmentBeginDate",
      render: (date) => <p>{convertToFullDate(date)}</p>,
    },
    {
      title: "Randevu Bitiş Tarihi",
      dataIndex: "appointmentEndDate",
      key: "appointmentEndDate",
      render: (date) => <p>{convertToFullDate(date)}</p>,
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
      <Row>
        <Col span={18}>
          <Title level={2}>{pageHeader}</Title>
        </Col>
        {/* <Col span={6}>
          <Button onClick={handleClick} block type="primary">
            Yeni Randevu Talep Et
          </Button>
        </Col> */}
      </Row>
      <Row>
        <Col span={10}>
          <Input placeholder="Ara.." onChange={handleChangeSearch} />
        </Col>
        <Col span={10}>
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
      <Row>
        <Col span={20}>
          {loading ? (
            <div>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
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
        <Row>
          <Col span={24}>Randevu İptal Nedeni</Col>
        </Row>
        <Row>
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
