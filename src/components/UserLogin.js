import React, { useState, useContext } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Form,
  Button,
  Checkbox,
  message,
} from "antd";
import { useHistory } from "react-router";
import background from "./../assets/img/login-background-image.png";
import { Link } from "react-router-dom";
import UserContext from "./../contexts/UserContext";
import API from "./../api";
const { Title } = Typography;

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
        localStorage.setItem("auth_token", res.data);
        message.success("Hoşgeldiniz!");
        setIsLoggedIn(true);
        setToken(res.data);
        setLoading(false);
        history.push("/");
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
            Giriş Yap
          </Title>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
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
              ]}
            >
              <Input placeholder="Lütfen Email Giriniz" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Lütfen Şifrenizi Giriniz" }]}
            >
              <Input.Password placeholder="Lütfen Şifrenizi Giriniz" />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: 8 }}
              wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
            >
              <Checkbox>Beni Hatırla</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" loading={loading} htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              Henüz Üye Değilmisin? <Link to="/signUp">Üye Ol</Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default UserLogin;
