import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Row, Col, Button, Typography, message } from "antd";
import { useHistory } from "react-router";
import UserContext from "./../contexts/UserContext";
import BreadCrumbContext from "./../contexts/BreadcrumbContext";
import API from "./../api";

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function ChangeMyPassword() {
  const [form] = Form.useForm();
  const { token } = useContext(UserContext);
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Hesap");
    setLastBreadcrumb("Şifremi Değiştir");
  }, []);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const changePasswordModel = {
      CurrentPassword: values.currentPassword,
      NewPassword: values.newPassword,
      NewPasswordConfirmation: values.newPasswordConfirmation,
    };
    setPassword(changePasswordModel);
  };

  const setPassword = async (changePasswordModel) => {
    setLoading(true);
    await API.put(`user/changePassword`, changePasswordModel, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.data.status) {
          message.success("Şifreniz Başarıyla Güncellendi!");
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
          message.error(error.response.data.message);
        }
      });
  };

  return (
    <div>
      <Row style={{ marginBottom: 10 }}>
        <Col span={23}>
          <Title style={{ textAlign: "center" }} level={2}>
            Şifre Değiştir
          </Title>
        </Col>
      </Row>
      <Form
        {...formItemLayout}
        form={form}
        name="changePassword"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="currentPassword"
          label="Mevcut Şifreniz"
          rules={[
            {
              required: true,
              message: "Lütfen Geçerli Olan Şifrenizi Giriniz",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Yeni Şifreniz"
          dependencies={["currentPassword"]}
          rules={[
            {
              required: true,
              message: "Lütfen Yeni Şifrenizi Giriniz",
            },
            { min: 8, message: "Şifreniz En Az 8 Karakterden Oluşmalıdır" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("currentPassword") != value) {
                  return Promise.resolve();
                }
                return Promise.reject("Yeni Şifreniz Eskisiyle Aynı Olamaz!");
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newPasswordConfirmation"
          label="Yeni Şifrenizi Onaylayınız"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Lütfen Yeni Şifrenizi Onaylayınız",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Şifreleriniz Uyuşmuyor!");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" loading={loading} htmlType="submit">
            Güncelle
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
