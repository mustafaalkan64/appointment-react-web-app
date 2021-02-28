import React, { useState, useContext } from "react";
import { Row, Col, Input, Form, Button, Checkbox, message, Card } from "antd";
import { useHistory } from "react-router";
import background from "../../assets/img/login-background-image.png";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import API from "../../api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const UserLogin = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setToken } = useContext(UserContext);
  const handleSubmit = async (values) => {
    setLoading(true);
    const user = {
      Email: values.email,
      Password: values.password,
    };
    await API.post(`user/authenticate`, user)
      .then((res) => {
        if (res.status) {
          const token = res.data.response;
          localStorage.setItem("auth_token", res.data.response);
          setToken(token);
          message.success("Hoşgeldiniz!");
          setIsLoggedIn(true);
          setLoading(false);
          history.push("/");
        } else {
          message.error(res.response);
        }
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
            title="Giriş Yap"
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
              name="login"
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
                    max: 50,
                    message:
                      "Email Adresiniz En Fazla 50 Karakterden Oluşmalıdır",
                  },
                ]}
              >
                <Input
                  placeholder="Lütfen Email Giriniz"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item
                label="Şifre"
                name="password"
                rules={[
                  { required: true, message: "Lütfen Şifrenizi Giriniz" },
                ]}
              >
                <Input.Password
                  placeholder="Lütfen Şifrenizi Giriniz"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Beni Hatırla</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                  <Link to="/forgotPassword">Şifreni mi Unuttun?</Link>
                </a>
              </Form.Item>

              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Button
                  type="primary"
                  loading={loading}
                  className="login-form-button"
                  htmlType="submit"
                >
                  Giriş Yap
                </Button>
                Henüz Üye Değilmisin? <Link to="/signUp">Üye Ol</Link>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default UserLogin;