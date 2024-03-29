import React, { useState, useContext } from "react";
import { Row, Col, Input, Form, Button, Checkbox, message, Card } from "antd";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import API from "../../api";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginStyle, headStyle } from "../../assets/styles/styles";

const UserLogin = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, setToken, setUserRole } = useContext(UserContext);
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
          setUserRole(res.data.role)
          setLoading(false);
          history.push("/");
        } else {
          message.error(res.response);
        }
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
            title="Giriş Yap"
            hoverable
            bordered={true}
            initialValues={{ remember: true }}
            // style={{ width: "100%" }}
            headStyle={headStyle}
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
                    type: "email",
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

              <Form.Item {...tailLayout}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Beni Hatırla</Checkbox>
                </Form.Item>

              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button
                  type="primary"
                  loading={loading}
                  htmlType="submit"
                >
                  Giriş Yap
                </Button>
              </Form.Item>
              <Form.Item {...tailLayout}>
                Henüz Üye Değilmisin? <Link to="/signUp">Üye Ol</Link>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Link to="/forgotPassword">Şifreni mi Unuttun?</Link>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default UserLogin;
