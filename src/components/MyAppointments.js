//src/components/pages/list.tsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Table, Row, Col, Button, Typography, Input } from "antd";
import { useHistory } from "react-router";
import { Tag, Space, message, Spin, Select } from "antd";
import API from "./../api";
import { serialize } from "./../utils";
import UserContext from "./../contexts/UserContext";

export default function MyAppointments(props) {
  const { Title } = Typography;
  const history = useHistory();
  const [myAppointments, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("");
  const type = props.isCanceled ? 0 : 1;
  const { token } = useContext(UserContext);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const pageHeader = props.isCanceled
    ? "İptal Ettiğim Randevularım"
    : "Aktif Randevularım";
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
    debugger;
    fetch({ pagination });
  }, [sortValue, searchText]);

  const cancelAppointment = async (obj) => {
    if (window.confirm("Randevuyu İptal Etmek İstediğinize Emin misiniz?")) {
      await API.put(
        `Appointment/cancelAppointment/${obj.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          message.success("Randevunuzu İptal Ettiniz.");
          fetch({ pagination });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            //history.push("/login");
            message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
          } else if (error.response.status === 404) {
            message.warning("Böyle Bir Randevu Bulunamadı");
          } else {
            message.error(error.response.data);
          }
        });
    }
  };

  const convertWithoutTimeZone = (datetime) => {
    var d = new Date(datetime);
    var month = d.getUTCMonth() + 1; //months from 1-12
    var day = d.getDate();
    var year = d.getUTCFullYear();

    var newdate = day + "." + month + "." + year;
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
    var queryString = serialize({
      current: params.pagination.current,
      pageSize: params.pagination.pageSize,
      type: type,
      searchText,
      sortValue,
    });
    await API.get(`Appointment/getByUserId?${queryString}`, {
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
        if (error.response.status === 401) {
          history.push("/login");
          message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
        } else {
          message.error("Randevuları Getirme Esnasında Hata ile Karşılaşıldı!");
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
      title: "Randevu Tarihi",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => <a>{convertWithoutTimeZone(date)}</a>,
    },
    {
      title: "Başlangıç Saati",
      dataIndex: "beginDate",
      key: "beginDate",
    },
    {
      title: "Bitiş Saati",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Durumu",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <div>
          <Tag color={status === 1 ? "green" : "red"}>
            {status == 1 ? "Aktif" : "Pasif"}
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
            onClick={() => cancelAppointment(obj)}
          >
            {obj.status == 1 ? "İptal Et" : "Aktif Et"}
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
    </div>
  );
}
