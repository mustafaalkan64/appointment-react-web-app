import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import UserContext from "./../contexts/UserContext";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  Typography,
  ConfigProvider,
  message,
} from "antd";
import API from "./../api";
import { UserOutlined } from "@ant-design/icons";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
import moment from "moment";

const { Title } = Typography;

const MyPersonelInformations = () => {
  const [form] = Form.useForm();
  const { token } = useContext(UserContext);
  const history = useHistory();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [birthday, setBirthday] = useState([]);
  const dateFormat = "DD.MM.YYYY";

  const style = { padding: "8px 0" };

  const setCurrenUser = (userForm) => {
    setLoading(true);
    API.put(`user/updateUser`, userForm, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.status) {
          message.success(res.data.response);
        } else {
          message.error(res.data.response);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          history.push("/login");
          message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
        } else {
          message.error(
            "Kişisel Bilgileri Güncelleme Sırasında Hata ile Karşılaşıldı!"
          );
        }
      });
  };

  const getCities = async () => {
    await API.get(`place/getCities`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setCities(res.data);
        console.log(form.city);
        console.log(cities);
      })
      .catch((error) => {
        message.error("Şehirleri Getirme Sırasında Hata ile Karşılaşıldı");
      });
  };

  const getDistricts = async (cityId) => {
    await API.get(`place/getDistrictsByCityId?cityId=${cityId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setDistricts(res.data);
        console.log(cities);
      })
      .catch((error) => {
        message.error("İlçeleri Getirme Sırasında Hata ile Karşılaşıldı");
      });
  };

  const getZones = async (districtId) => {
    await API.get(`place/GetZonesByDistrictId?districtId=${districtId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setZones(res.data);
        console.log(cities);
      })
      .catch((error) => {
        message.error("Bölgeleri Getirme Sırasında Hata ile Karşılaşıldı");
      });
  };

  useEffect(() => {
    forceUpdate({});
    const getCurrentUser = async () => {
      setLoading(true);
      await API.get(`user/currentUser?`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLoading(false);
          var d = new Date(res.data.birthday);
          var birthday = d.toLocaleString("tr-TR").substring(0, 10);
          setBirthday(res.data.birthday);
          form.setFieldsValue({
            name: res.data.firstName,
            surname: res.data.lastName,
            email: res.data.email,
            birthDay: birthday,
            city: res.data.cityId,
            district: res.data.districtId,
            zone: res.data.zoneId,
          });
          getDistricts(res.data.cityId);
          getZones(res.data.districtId);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
            message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
          } else {
            message.error(
              "Kişisel Bilgileri Getirme Esnasında Hata ile Karşılaşıldı!"
            );
          }
        });
    };
    getCities();
    getCurrentUser();
  }, []);

  const handleCityChange = (value) => {
    setDistricts([]);
    form.setFieldsValue({
      district: "",
      zone: "",
    });
    getDistricts(value);
  };

  const handleDistrictChange = (value) => {
    setZones([]);
    form.setFieldsValue({
      zone: "",
    });
    getZones(value);
  };

  const handleZoneChange = (value) => {};

  const onBirthdayChange = (date, dateString) => {
    form.setFieldsValue({
      birthDay: dateString,
    });
  };

  const onFinish = (values) => {
    const userForm = {
      Name: values.name,
      Surname: values.surname,
      CityId: values.city,
      DistrictId: values.district,
      ZoneId: values.zone,
      BirthDay: values.birthDay,
    };
    setCurrenUser(userForm);
  };
  return (
    <div>
      <Row>
        <Col span={23}>
          <Title style={{ textAlign: "center" }} level={2}>
            Kişisel Bilgilerim
          </Title>
        </Col>
      </Row>

      <Form
        form={form}
        name="horizontal_login"
        layout="horizontal"
        onFinish={onFinish}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8} offset={4}>
            <div style={style}>
              <Form.Item
                label="İsim"
                name="name"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen İsminizi Giriniz!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="İsim"
                />
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div style={style}>
              <Form.Item
                name="surname"
                label="Soyisim"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Soyisminizi Giriniz!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Soyisim"
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8} offset={4}>
            <div style={style}>
              <Form.Item
                name="birthDay"
                label="Doğum Tarihi"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Doğum Tarihinizi Giriniz!",
                  },
                ]}
              >
                <ConfigProvider locale={locale}>
                  <DatePicker
                    format={dateFormat}
                    defaultValue={moment(birthday)}
                    onChange={onBirthdayChange}
                    placeholder="Doğum Tarihiniz"
                    style={{ width: "100%" }}
                  />
                </ConfigProvider>
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div style={style}>
              <Form.Item
                name="email"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                label="Email"
              >
                <Input placeholder="email" disabled="disabled" />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8} offset={4}>
            <div style={style}>
              <Form.Item
                name="city"
                label="İl"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen İl Giriniz!",
                  },
                ]}
              >
                <Select
                  size={"default"}
                  onChange={handleCityChange}
                  style={{ width: "100%" }}
                >
                  {cities.map((city, key) => {
                    return (
                      <option value={city.id} key={city.id}>
                        {city.cityName}
                      </option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div style={style}>
              <Form.Item
                name="district"
                label="İlçe"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen İlçe Giriniz!",
                  },
                ]}
              >
                <Select
                  size={"default"}
                  onChange={handleDistrictChange}
                  style={{ width: "100%" }}
                >
                  {districts.map((district, key) => {
                    return (
                      <option value={district.id} key={district.id}>
                        {district.districtName}
                      </option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8} offset={4}>
            <div style={style}>
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                name="zone"
                label="Köy/Mahalle"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Semt/Mahalle Giriniz!",
                  },
                ]}
              >
                <Select
                  size={"default"}
                  onChange={handleZoneChange}
                  style={{ width: "100%" }}
                >
                  {zones.map((zone, key) => {
                    return (
                      <option value={zone.id} key={zone.id}>
                        {zone.zoneName}
                      </option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8} offset={6}>
            <div style={style}>
              <Form.Item shouldUpdate={true}>
                {() => (
                  <Button
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                    disabled={
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    Kaydet
                  </Button>
                )}
              </Form.Item>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default MyPersonelInformations;
