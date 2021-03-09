import React, { useState } from "react";
import { Row, Col, Input, Form, Button, message, Card } from "antd";
import { Link } from "react-router-dom";
import API from "../../api";
import { loginStyle } from "../../assets/styles/styles";

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values) => {
    setLoading(true);
    const forgotPasswordModel = {
      Email: values.email,
    };
    await API.post(`user/forgotPassword`, forgotPasswordModel)
      .then((res) => {
        message.success(
          "Şifrenizi Yenilemek İçin Gerekli Olan İşlemleri Email Adresinize Gönderdik!"
        );
        setLoading(false);
      })
      .catch((error) => {
        if (error.response != undefined) {
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

  return (
    <div style={loginStyle}>
      <Row>
        <Col span={12} offset={6}>
          <Card
            title="Şifremi Unuttum"
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
              name="forgotPassword"
              layout="horizontal"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Lütfen Email Adresi Giriniz",
                  },
                  {
                    type: "email",
                    message: "Email Adresinizi Doğru Formatta Değil",
                  },
                  {
                    max: 50,
                    message:
                      "Email Adresiniz En Fazla 50 Karakterden Oluşmalıdır",
                  },
                ]}
              >
                <Input placeholder="Lütfen Email Giriniz" />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button
                  type="primary"
                  loading={loading}
                  className="login-form-button"
                  htmlType="submit"
                >
                  Şifre Gönder
                </Button>
                <Link to="/login">Login</Link> Sayfasına Geri Dön
              </Form.Item>
              <Form.Item
                wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
              ></Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ForgotPassword;
