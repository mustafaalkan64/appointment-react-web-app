import React, { useState, useEffect } from "react";
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
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/tr";
import locale from "antd/lib/locale/tr_TR";
const { Option } = Select;
const { Title } = Typography;

const MyPersonelInformations = () => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({}); // To disable submit button at the beginning.
  const dateFormat = "DD.MM.YYYY";

  const style = { padding: "8px 0" };
  const cities = [
    { id: 1, cityname: "İzmir" },
    { id: 2, cityname: "Ankara" },
  ];
  console.log(cities);

  const cityOptions = [];
  const districtOptions = [];
  cities.map((city) => {
    cityOptions.push(<Option key={city.id}>{city.cityname}</Option>);
  });

  useEffect(() => {
    forceUpdate({});
  }, []);

  const handleCityChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const handleDistrictChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const onBirthdayChange = (date, dateString) => {};

  const onFinish = (values) => {
    console.log("Finish:", values);
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
                name="name"
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
              <Form.Item name="email">
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
                  {cityOptions}
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div style={style}>
              <Form.Item
                name="district"
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
                  {districtOptions}
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Log in
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
export default MyPersonelInformations;
