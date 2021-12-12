import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Select,
  ConfigProvider,
  message,
  Spin,
  Card,
} from "antd";
import API from "../../api";
import { UserOutlined } from "@ant-design/icons";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
import moment from "moment";
import { cardStyle, headStyle } from "../../assets/styles/styles";

const UserProfile = () => {
  const [form] = Form.useForm();
  const { token } = useContext(UserContext);
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const history = useHistory();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [userBirthday, setUserBirthday] = useState("");
  const dateFormat = "DD.MM.YYYY";
  const { Option } = Select;

  const setCurrenUser = (userForm) => {
    setLoading(true);
    debugger;
    API.put("user/updateUser", userForm, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        message.success(res.data.response);
        setLoading(false);
      })
      .catch((error) => {
        debugger;
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
      })
      .catch((error) => {
        console.log("İlçeleri Getirme Sırasında Hata ile Karşılaşıldı");
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
      })
      .catch((error) => {
        console.log("Bölgeleri Getirme Sırasında Hata ile Karşılaşıldı");
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
          var d = new Date(res.data.birthday);
          var birthdaystring = d.toLocaleString("tr-TR").substring(0, 10);
          setUserBirthday(birthdaystring);
          form.setFieldsValue({
            name: res.data.firstName,
            surname: res.data.lastName,
            email: res.data.email,
            birthDay: birthdaystring,
            city: res.data.cityId,
            district: res.data.districtId,
            zone: res.data.zoneId,
            username: res.data.username,
          });
          getDistricts(res.data.cityId);
          getZones(res.data.districtId);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
          }
          else if (error.response.status === 403) {
            history.push("/shopProfile");
          }
          else {
            message.error(error.response.data.message);
          }
          setLoading(false);
        });
    };

    getCities();
    getCurrentUser();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Hesap");
    setLastBreadcrumb("Profilim");
  }, [
    // getCurrentUser,
    setFirstBreadcrumb,
    setLastBreadcrumb,
    setSecondBreadcrumb,
    form,
    history,
    token,
  ]);

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

  const handleZoneChange = (value) => { };

  const onBirthdayChange = (date, dateString) => {
    form.setFieldsValue({
      birthDay: date,
    });
    setUserBirthday(dateString);
  };

  const onFinish = (values) => {
    const userForm = {
      FirstName: values.name,
      LastName: values.surname,
      CityId: values.city,
      DistrictId: values.district,
      ZoneId: values.zone,
      Birthday: values.birthDay,
      Username: values.username,
    };
    setCurrenUser(userForm);
  };

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  return (
    <div>
      <Spin spinning={loading} delay={500}>
        <Row>
          <Col span={22} offset={1}>
            <Card
              title="Kullanıcı Profili"
              hoverable
              bordered={true}
              style={cardStyle}
              headStyle={headStyle}
            >
              <Form
                form={form}
                name="horizontal_login"
                layout="horizontal"
                {...layout}
                onFinish={onFinish}
              >
                <Form.Item
                  label="İsim"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen İsminizi Giriniz!",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined className="site-form-item-icon" />
                    }
                    placeholder="İsim"
                  />
                </Form.Item>

                <Form.Item
                  name="surname"
                  label="Soyisim"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen Soyisminizi Giriniz!",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined className="site-form-item-icon" />
                    }
                    placeholder="Soyisim"
                  />
                </Form.Item>

                <Form.Item
                  name="birthDay"
                  label="Doğum Tarihi"
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
                      defaultValue={moment(userBirthday, dateFormat)}
                      value={moment(userBirthday, dateFormat)}
                      onChange={onBirthdayChange}
                      placeholder="Doğum Tarihiniz"
                      style={{ width: "100%" }}
                    />
                  </ConfigProvider>
                </Form.Item>


                <Form.Item
                  name="username"
                  label="Kullanıcı Adı"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen Kullanıcı Adını Giriniz!",
                    },
                  ]}
                >
                  <Input placeholder="Kullanıcı Adı" />
                </Form.Item>



                <Form.Item
                  name="email"
                  label="Email"
                >
                  <Input placeholder="email" disabled="disabled" />
                </Form.Item>

                <Form.Item
                  name="city"
                  label="İl"
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
                        <Option value={city.id} key={city.id}>
                          {city.cityName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="district"
                  label="İlçe"
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
                        <Option value={district.id} key={district.id}>
                          {district.districtName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>


                <Form.Item
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
                        <Option value={zone.id} key={zone.id}>
                          {zone.zoneName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>


                <Form.Item
                  wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
                  shouldUpdate={true}
                >
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

              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
export default UserProfile;
