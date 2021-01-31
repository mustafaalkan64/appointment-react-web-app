import React, { useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Typography, Input, Form, Button, message } from "antd";
import { useHistory } from "react-router";
import background from "./../assets/img/login-background-image.png";
import API from "./../api";
const { Title } = Typography;

const ResetPassword = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { verify_token } = useParams();
  const handleSubmit = async (values) => {
    setLoading(true);
    const resetPasswordModel = {
      Password: values.password,
      VerifyToken: verify_token,
    };
    await API.post(`user/resetPassword`, resetPasswordModel)
      .then((res) => {
        message.success("Şifrenizi Başarıyla Güncellediniz!");
        history.push("/login");
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
        marginTop: 70,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        height: "974px",
        backgroundSize: "cover",
      }}
    >
      <Row>
        <Col span={23}>
          <Title style={{ textAlign: "center" }} level={2}>
            Şifremi Güncelle
          </Title>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Form
            {...layout}
            form={form}
            name="resetPassword"
            layout="horizontal"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Şifre"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Lütfen Şifrenizi Giriniz",
                },
                { min: 8, message: "Şifreniz En Az 8 Karakterden Oluşmalıdır" },
              ]}
            >
              <Input.Password placeholder="Lütfen Şifrenizi Giriniz" />
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
              <Input.Password placeholder="Lütfen Şifreyi Onaylayınız" />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" loading={loading} htmlType="submit">
                Şifremi Güncelle
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default ResetPassword;
