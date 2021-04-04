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
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import API from "../../api";
import { registerStyle, headStyle } from "../../assets/styles/styles";

const ShopRegister = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const { setIsLoggedIn, setToken } = useContext(UserContext);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;

  const handleSubmit = (values) => {
    const shopRegisterModel = {
      Email: values.email,
      Password: values.password,
      ShopTitle: values.shopTitle,
      Address: values.shopAddress,
      ShopDescription: values.shopDescription,
      OwnerName: values.ownerName,
      PhoneNumber: values.phone,
      WebSite: values.website,
      CityId: values.city,
      DistrictId: values.district,
      ZoneId: values.zone,
      TaxNumber: values.taxNumber,
      TaxAddress: values.taxAddress,
      Categories: values.categories,
    };
    setLoading(true);
    API.post(`shop/register`, shopRegisterModel)
      .then((res) => {
        localStorage.setItem("auth_token", res.data.response);
        message.success("You've Registered Successfuly!");
        setIsLoggedIn(true);
        setToken(res.data.response);
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        if (error.response !== undefined) {
          message.error(error.response.data);
        } else {
          message.error(
            "Şüpheli karakterler tespit edildi. < > & gibi karakterleri kaldırıp lütfen tekrar deneyiniz."
          );
        }
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

  const getCategories = async () => {
    await API.get(`categories/getCategories`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        message.error("Kategorileri Getirme Sırasında Hata ile Karşılaşıldı");
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
    getCategories();
  }, []);

  return (
    <div style={registerStyle}>
      <Row>
        <Col span={12} offset={6}>
          <Card
            title="Yeni Mağaza Kaydı"
            hoverable
            bordered={true}
            style={{ width: "100%" }}
            headStyle={headStyle}
          >
            <Form
              {...layout}
              form={form}
              name="register"
              layout="horizontal"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="shopTitle"
                label="Mağaza Unvanı"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Mağaza Unvanı Giriniz",
                  },
                ]}
              >
                <Input placeholder="Mağaza Unvanı" />
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
              <Form.Item name="taxNumber" label="Vergi Numarası">
                <Input placeholder="Vergi Numarası" />
              </Form.Item>
              <Form.Item name="taxAddress" label="Vergi Adresi">
                <Input placeholder="Vergi Adresi" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Telefon Numarası"
                rules={[
                  {
                    max: 10,
                    message:
                      "Telefon Numarası Belirlenen Max Karakter Sınırını Geçemezsiniz",
                  },
                ]}
              >
                <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item name="website" label="Website">
                <AutoComplete
                  options={websiteOptions}
                  onChange={onWebsiteChange}
                  placeholder="website"
                >
                  <Input />
                </AutoComplete>
              </Form.Item>
              <Form.Item
                name="shopDescription"
                label="Mağaza Açıklaması"
                rules={[
                  {
                    max: 500,
                    message:
                      "Mağaza Açıklaması En Fazla 500 Karakterden Oluşabilir",
                  },
                ]}
              >
                <TextArea placeholder="Mağaza Açıklaması" />
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
                name="categories"
                label="Kategoriler"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Kategori(ler) Seçiniz!",
                  },
                ]}
              >
                <Select mode="tags" size={"default"} style={{ width: "100%" }}>
                  {categories.map((category, key) => {
                    return (
                      <Option value={category.id} key={category.id}>
                        {category.categoryName}
                      </Option>
                    );
                  })}
                </Select>
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
