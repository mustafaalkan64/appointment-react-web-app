import React, { useState, useContext } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Form,
  Button,
  Radio,
  message,
  Checkbox,
  Card,
} from "antd";
import { useHistory } from "react-router";
import background from "./../assets/img/login-background-image.png";
import { Link } from "react-router-dom";
import UserContext from "./../contexts/UserContext";
import API from "./../api";
const { Title } = Typography;

const UserRegister = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const { setIsLoggedIn, setToken } = useContext(UserContext);
  const handleSubmit = (values) => {
    const user = {
      Email: values.email,
      Password: values.password,
      FirstName: values.name,
      LastName: values.surname,
      UserName: values.username,
      Gender: values.gender,
    };
    setLoading(true);
    API.post(`user/register`, user)
      .then((res) => {
        localStorage.setItem("auth_token", res.data.response);
        message.success("You've Registered Successfuly!");
        setIsLoggedIn(true);
        setToken(res.data.response);
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
        paddingTop: 120,
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        height: "965px",
        backgroundSize: "cover",
      }}
    >
      <Row>
        <Col span={12} offset={6}>
        <Card
            title="Üye Kaydı"
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
            name="register"
            layout="horizontal"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Ad"
              rules={[
                {
                  required: true,
                  message: "Lütfen Adınızı Giriniz",
                },
              ]}
            >
              <Input placeholder="Lütfen Adınızı Giriniz" />
            </Form.Item>
            <Form.Item
              name="surname"
              label="Soyad"
              rules={[
                {
                  required: true,
                  message: "Lütfen Soyadınızı Giriniz",
                },
              ]}
            >
              <Input placeholder="Lütfen Soyadınızı Giriniz" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Kullanıcı Adı"
              rules={[
                {
                  required: true,
                  message: "Lütfen Kullanıcı Adı Giriniz",
                },
              ]}
            >
              <Input placeholder="Lütfen Kullanıcı Adı Giriniz" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Email Adresinizi Doğru Formatta Değil!",
                },
                {
                  required: true,
                  message: "Lütfen Email Adresinizi Giriniz",
                },
              ]}
            >
              <Input placeholder="Lütfen Email Adresinizi Giriniz" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Şifre"
              rules={[
                {
                  required: true,
                  message: "Lütfen Şifrenizi Giriniz",
                },
                { min: 8, message: "Şifreniz En Az 8 Karakterden Oluşmalıdır" },
              ]}
              hasFeedback
            >
              <Input.Password />
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
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Cinsiyet"
              rules={[
                {
                  required: true,
                  message: "Please select your gender",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="0">Kadın</Radio>
                <Radio value="1">Erkek</Radio>
                <Radio value="2">Diğer</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              style={{ marginBottom: 8 }}
              wrapperCol={{ ...layout.wrapperCol, offset: 6 }}
            >
              <Checkbox>
                I have read the <Link to="Agreement" value="agreement" />
              </Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button
                type="primary"
                className="login-form-button"
                loading={loading}
                htmlType="submit"
              >
                Üye Ol
              </Button>
              Zaten Üye misin? <Link to="/login">Giriş Yap</Link>
            </Form.Item>
          </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default UserRegister;
