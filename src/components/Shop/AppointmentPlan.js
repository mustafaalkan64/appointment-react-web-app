import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import {
  Form,
  Button,
  Row,
  Col,
  TimePicker,
  Select,
  Typography,
  message,
  ConfigProvider,
} from "antd";
import API from "../../api";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
import moment from "moment";

const { Title } = Typography;

const AppointmentPlan = () => {
  const [form] = Form.useForm();
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const history = useHistory();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeRanges, setTimeRanges] = useState([]);
  const [size] = React.useState("default");
  const { Option } = Select;
  const format = "HH:mm";
  const { RangePicker } = TimePicker;
  const [componentSize, setComponentSize] = useState("default");
  const token = localStorage.getItem("auth_token");
  moment.locale("tr-TR");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const createAppointmentPlan = (createAppointmentPlanForm) => {
    debugger;
    setLoading(true);
    API.post(`shop/createOrUpdateAppointment`, createAppointmentPlanForm, {
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

  useEffect(() => {
    forceUpdate({});

    const getAppointmentPlan = async () => {
      setLoading(true);
      await API.get(`shop/getAppointmentPlan`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.data != "") {
            form.setFieldsValue({
              weekdays: res.data.weekDays,
              appointmentPeriod: parseInt(res.data.appointmentPeriod),
              startTime: moment(res.data.startTime, format),
              endTime: moment(res.data.endTime, format),
              emptyTimeRange: [
                moment(res.data.emptyTimeRange[0], format),
                moment(res.data.emptyTimeRange[1], format),
              ],
              appointmentLong: parseInt(res.data.appointmentLong),
            });
            setStartTime(moment(res.data.startTime, format));
            setEndTime(moment(res.data.endTime, format));

            let times = [];
            res.data.emptyTimeRange.map((item) => {
              if (item != undefined) {
                times.push(item);
              }
            });
            setTimeRanges(times);
          }
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
    getAppointmentPlan();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Randevular");
    setLastBreadcrumb("Randevu Oluştur");
  }, []);

  function handleChange(value) {
    console.log(`Selected: ${value}`);
  }

  function onStartTimeChange(time, timeString) {
    setStartTime(time);
  }

  function onEndTimeChange(time, timeString) {
    setEndTime(time);
  }

  function onTimeRangeChange(time, timeString) {
    var times = [];
    time.map((item) => {
      if (item != undefined) {
        times.push(item.format("HH:mm"));
      }
    });
    setTimeRanges(times);
  }

  const onFinish = (values) => {
    const createAppointmentPlanForm = {
      weekDays: values.weekdays,
      appointmentPeriod: parseInt(values.appointmentPeriod),
      startTime: startTime.format("HH:mm"),
      endTime: endTime.format("HH:mm"),
      emptyTimeRange: timeRanges,
      appointmentLong: parseInt(values.appointmentLong),
    };
    createAppointmentPlan(createAppointmentPlanForm);
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 10,
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
        {...layout}
        name="createAppointmentForm"
        layout="horizontal"
        initialValues={{
          size: componentSize,
        }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        onFinish={onFinish}
      >
        <Form.Item
          label="Hizmet Verilen Günler"
          name="weekdays"
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
            <Option value="1" key="1">
              Pazartesi
            </Option>
            <Option value="2" key="2">
              Salı
            </Option>
            <Option value="3" key="3">
              Çaşamba
            </Option>
            <Option value="4" key="4">
              Perşembe
            </Option>
            <Option value="5" key="5">
              Cuma
            </Option>
            <Option value="6" key="6">
              Cumartesi
            </Option>
            <Option value="0" key="0">
              Pazar
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Randevu Period (Dakika)"
          name="appointmentPeriod"
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

        <ConfigProvider locale={locale}>
          <Form.Item
            label="Açılış Saati"
            name="startTime"
            rules={[
              {
                required: true,
                message: "Lütfen Saat Giriniz!",
              },
            ]}
          >
            <TimePicker
              onChange={onStartTimeChange}
              defaultValue={moment("00:00", format)}
              format={format}
            />
          </Form.Item>
        </ConfigProvider>

        <ConfigProvider locale={locale}>
          <Form.Item
            label="Kapanış Saati"
            name="endTime"
            rules={[
              {
                required: true,
                message: "Lütfen Saat Giriniz!",
              },
            ]}
          >
            <TimePicker
              onChange={onEndTimeChange}
              defaultValue={moment("00:00", format)}
              format={format}
            />
          </Form.Item>
        </ConfigProvider>

        <ConfigProvider locale={locale}>
          <Form.Item
            label="Mola Aralığı"
            name="emptyTimeRange"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
          >
            <RangePicker
              format={format}
              onChange={onTimeRangeChange}
              defaultValue={moment("00:00", format)}
            />
          </Form.Item>
        </ConfigProvider>

        <Form.Item
          label="Hizmet Süresi"
          name="appointmentLong"
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
            <Option key="15">15 Gün</Option>
            <Option key="30">1 Ay</Option>
            <Option key="60">2 Ay</Option>
            <Option key="90">3 Ay</Option>
            <Option key="180">6 Ay</Option>
          </Select>
        </Form.Item>

        <Form.Item
          wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
          shouldUpdate={true}
        >
          {() => (
            <Button
              type="primary"
              loading={loading}
              htmlType="submit"
              disabled={
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Oluştur
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
export default AppointmentPlan;
