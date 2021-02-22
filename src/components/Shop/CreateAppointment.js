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
  TimePicker,
  Select,
  Typography,
  ConfigProvider,
  message,
} from "antd";
import API from "../../api";
import { UserOutlined } from "@ant-design/icons";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
import moment from "moment";

const { Title } = Typography;

const CreateAppointment = () => {
  const [form] = Form.useForm();
  const { token } = useContext(UserContext);
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const history = useHistory();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [loading, setLoading] = useState([]);
  const [userBirthday, setUserBirthday] = useState("");
  const [size, setSize] = React.useState("default");
  const dateFormat = "DD.MM.YYYY";
  const { Option } = Select;
  const format = "HH:mm";
  const { RangePicker } = TimePicker;

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
        message.success(res.data.response);
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
        console.log(userBirthday);
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

  useEffect(() => {
    forceUpdate({});

    getCurrentUser();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Randevular");
    setLastBreadcrumb("Randevu Oluştur");
  }, []);

  function handleChange(value) {
    console.log(`Selected: ${value}`);
  }

  function onTimeChange(time, timeString) {
    console.log(time, timeString);
  }

  const onFinish = (values) => {
    const userForm = {
      FirstName: values.name,
      LastName: values.surname,
      CityId: values.city,
      DistrictId: values.district,
      ZoneId: values.zone,
      BirthDay: values.birthDay,
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
      <Row>
        <Col span={23}>
          <Title style={{ textAlign: "center" }} level={2}>
            Randevu Oluştur
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
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                label="Hizmet Verilen Günler"
                name="name"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Boş Bırakmayınız!",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  size={size}
                  placeholder="Seçiniz"
                  defaultValue={[]}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <Option key="Pzt">Pazartesi</Option>
                  <Option key="Salı">Salı</Option>
                  <Option key="Çar">Çaşamba</Option>
                  <Option key="Per">Perşembe</Option>
                  <Option key="Cum">Cuma</Option>
                  <Option key="Cmt">Cumartesi</Option>
                  <Option key="Pz">Pazar</Option>
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                label="Randevu Period (Dakika)"
                name="appointmentRange"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Boş Bırakmayınız!",
                  },
                ]}
              >
                <Select
                  size={size}
                  placeholder="Seçiniz"
                  defaultValue={[]}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <Option key="15">15</Option>
                  <Option key="30">30</Option>
                  <Option key="60">60</Option>
                  <Option key="90">90</Option>
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                label="Açılış Saati"
                name="startTime"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Saat Giriniz!",
                  },
                ]}
              >
                <TimePicker
                  defaultValue={moment("00:00", format)}
                  format={format}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                label="Kapanış Saati"
                name="endTime"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Saat Giriniz!",
                  },
                ]}
              >
                <TimePicker
                  defaultValue={moment("00:00", format)}
                  format={format}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                label="Hizmet Verilmeyen Zaman Dilimi"
                name="unUsedTime"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 18 }}
                rules={[
                  {
                    required: true,
                    message: "Lütfen Saat Giriniz!",
                  },
                ]}
              >
                <RangePicker
                  format={format}
                  defaultValue={moment("00:00", format)}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12} offset={4}>
            <div style={style}>
              <Form.Item
                wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                shouldUpdate={true}
              >
                {() => (
                  <Button
                    type="primary"
                    loading={loading}
                    htmlType="submit"
                    style={{ width: "100%" }}
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
export default CreateAppointment;
