import React, { useState } from "react";
import { Row, Col, Typography, Input, Form, Button, message, Card } from "antd";
import background from "./../assets/img/login-background-image.png";
import { Link } from "react-router-dom";
import API from "./../api";
const { Title } = Typography;

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

  return (
    <div
      style={{
        paddingTop: 150,
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
      }}
    >
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
