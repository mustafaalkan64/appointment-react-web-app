import React, { useState } from "react";
import { useParams } from "react-router";
import { Row, Col, Input, Form, Button, message, Card } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import { loginStyle } from "../../assets/styles/styles";

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
      span: 16,
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
            title="Şifremi Yenile"
            hoverable
            bordered={true}
            headStyle={{
              textAlign: "center",
              fontSize: "19px",
            }}
          >
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
                  {
                    min: 8,
                    message: "Şifreniz En Az 8 Karakterden Oluşmalıdır",
                  },
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

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  Şifremi Güncelle
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default ResetPassword;
