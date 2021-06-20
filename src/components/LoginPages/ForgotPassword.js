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
  const tailLayout = {
    wrapperCol: { offset: 6, span: 16 },
  };

  return (
    <div style={loginStyle}>
      <Row>
        <Col span={20} offset={2}>
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
              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  Şifre Gönder
                </Button>
              </Form.Item>
              <Form.Item
                {...tailLayout}
              >
                <Link to="/login">Login</Link> Sayfasına Geri Dön
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ForgotPassword;
