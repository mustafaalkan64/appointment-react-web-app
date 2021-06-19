import React, { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Form,
  Button,
  Select,
  message,
  Card,
  AutoComplete,
  Spin,
  Image,
} from "antd";
import { useHistory } from "react-router";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import API from "../../api";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import { imageUrlDirectory } from "../../constUrls";
import { UploadOutlined } from "@ant-design/icons";

const ShopProfile = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState();
  const token = localStorage.getItem("auth_token");
  const [saveLoading] = useState(false);
  const [logo, setLogo] = useState("");
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);
  const { setUsername } = useContext(UserContext);
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;
  const [shopId, setShopId] = useState(null);

  const handleSubmit = (values) => {
    const shopProfileModel = {
      Id: shopId,
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
      Email: values.email,
    };
    setLoading(true);
    API.put(`shop/updateShopProfile`, shopProfileModel, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        message.success("Başarıyla Güncellediniz!");
        setUsername(values.shopTitle);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response !== undefined) {
          message.error(error.response.data);
        } else {
          message.error(
            "Güncelleme Esnasında Hata ile Karşılaşıldı!"
          );
        }
        setLoading(false);
      });
  };

  const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select defaultValue="+90" style={{ width: 70 }}>
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

  const uploadFile = async (e) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("formFile", file);
    formData.append("fileName", fileName);
    try {
      await API.post("file/uploadFile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLogo(imageUrlDirectory + res.data.response);
          setLoading(false);
          message.success("Logo Başarıyla Yüklendi");
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
          } else {
            message.error(error.response.data);
          }
          setLoading(false);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
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

  const handleZoneChange = (value) => { };

  const websiteOptions = autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  useEffect(() => {
    const getShopProfile = async () => {
      setLoading(true);
      await API.get(`shop/getShopProfile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setShopId(res.data.id);
          setLogo(imageUrlDirectory + res.data.logoUrl);
          form.setFieldsValue({
            shopTitle: res.data.shopTitle,
            shopDescription: res.data.shopDescription,
            email: res.data.email,
            city: res.data.cityId,
            district: res.data.districtId,
            zone: res.data.zoneId,
            Email: res.data.email,
            shopAddress: res.data.address,
            ownerName: res.data.ownerName,
            website: res.data.webSite,
            taxNumber: res.data.taxNumber,
            taxAddress: res.data.taxAddress,
            phone: res.data.phoneNumber,
          });
          getDistricts(res.data.cityId);
          getZones(res.data.districtId);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
          } else if (error.response.status === 403) {
            history.push("/userProfile");
          } else {
            message.error(error.response.data);
          }
          setLoading(false);
        });
    };
    getCities();
    getShopProfile();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Hesap");
    setLastBreadcrumb("Mağaza Profil Sayfası");
  }, [
    form,
    history,
    setFirstBreadcrumb,
    setLastBreadcrumb,
    setSecondBreadcrumb,
    token,
  ]);

  return (
    <div>
      <Spin spinning={loading} delay={500}>
        <Row>
          <Col span={22} offset={2}>
            <Card
              title="Mağaza Profili"
              hoverable
              bordered={true}
              style={cardStyle}
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
                  <Input
                    addonBefore={prefixSelector}
                    style={{ width: "100%" }}
                  />
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

                <Form.Item name="shopAddress" label="Mağaza Adresi">
                  <TextArea placeholder="Mağaza Adresi" />
                </Form.Item>

                <Form.Item name="email" label="Email">
                  <Input placeholder="email" disabled="disabled" />
                </Form.Item>

                <Form.Item
                  name="logo"
                  label="Logo"
                >
                  <Row>
                    <Col>
                      <input type="file" onChange={saveFile} />
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={saveLoading}
                        onClick={() => uploadFile()}
                        htmlType="button"
                      >
                        Yükle
                          </Button>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: 10, marginLeft: 0 }}>
                    <Col>
                      <Image.PreviewGroup>
                        <Image width={150} src={logo} />
                      </Image.PreviewGroup>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button
                    type="primary"
                    style={{ width: "80%" }}
                    loading={loading}
                    htmlType="submit"
                  >
                    Kaydet
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
export default ShopProfile;
