import React, { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  Select,
  message,
  Checkbox,
  Card,
  AutoComplete,
} from "antd";
import { useHistory } from "react-router";
import background from "./../assets/img/login-background-image.png";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import API from "../api";

const ShopRegister = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const { setIsLoggedIn, setToken } = useContext(UserContext);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;

  const handleSubmit = (values) => {
    const user = {
      Email: values.email,
      Password: values.password,
      FirstName: values.name,
      LastName: values.surname,
      UserName: values.username,
      Gender: values.gender,
    };
    setLoading(true);
    API.post(`user/register`, user)
      .then((res) => {
        localStorage.setItem("auth_token", res.data.response);
        message.success("You've Registered Successfuly!");
        setIsLoggedIn(true);
        setToken(res.data.response);
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        message.error(error.response.data);
        setLoading(false);
      });
  };

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="+90">+90</Option>
      </Select>
    </Form.Item>
  );

  const onWebsiteChange = (value) => {
    if (!value) {
      setAutoCompleteResult([]);
    } else {
      setAutoCompleteResult(
        [".com", ".org", ".net"].map((domain) => `${value}${domain}`)
      );
    }
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
      })
      .catch((error) => {
        message.error("Bölgeleri Getirme Sırasında Hata ile Karşılaşıldı");
      });
  };

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

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 6,
      },
    },
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <div
      style={{
        paddingTop: 60,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        height: "980px",
        backgroundSize: "cover",
      }}
    >
      <Row>
        <Col span={12} offset={6}>
          <Card
            title="Mağaza Kaydı"
            hoverable
            bordered={true}
            style={{ width: "100%" }}
            headStyle={{
              textAlign: "center",
              fontSize: "19px",
            }}
          >
            <Form
              {...layout}
              form={form}
              name="register"
              layout="horizontal"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="shopName"
                label="Mağaza Adı"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Mağaza Adını Giriniz",
                  },
                ]}
              >
                <Input placeholder="Mağaza Adı" />
              </Form.Item>
              <Form.Item
                name="ownerName"
                label="Mağaza Sahibi"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Mağaza Sahibini Giriniz",
                  },
                ]}
              >
                <Input placeholder="Mağaza Sahibi" />
              </Form.Item>
              <Form.Item name="phone" label="Telefon">
                <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="website"
                label="Website"
                rules={[{ required: true, message: "Please input website!" }]}
              >
                <AutoComplete
                  options={websiteOptions}
                  onChange={onWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete>
              </Form.Item>
              <Form.Item name="shopDetail" label="Mağaza Detay">
                <TextArea placeholder="Mağaza Detay" />
              </Form.Item>

              <Form.Item
                name="city"
                label="İl"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
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

              <Form.Item name="shopAddress" label="Mağaza Adresi">
                <TextArea placeholder="Mağaza Adresi" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Email Adresinizi Doğru Formatta Değil!",
                  },
                  {
                    required: true,
                    message: "Lütfen Email Adresinizi Giriniz",
                  },
                ]}
              >
                <Input placeholder="Lütfen Email Adresinizi Giriniz" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Şifre"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Şifrenizi Giriniz",
                  },
                  {
                    min: 8,
                    message: "Şifreniz En Az 8 Karakterden Oluşmalıdır",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Şifreyi Onayla"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Lütfen Şifrenizi Onaylayınız",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Girdiğiniz Şifreler Eşleşmiyor!");
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject("Should accept agreement"),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="">agreement</a>
                </Checkbox>
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button
                  type="primary"
                  className="login-form-button"
                  loading={loading}
                  htmlType="submit"
                >
                  Mağaza Aç
                </Button>
                Zaten Üye misin? <Link to="/login">Giriş Yap</Link>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ShopRegister;
