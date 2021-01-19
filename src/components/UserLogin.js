import React, {useState, useContext} from 'react';
import {Row, Col, Typography, Input, Form, Button, Checkbox, message} from 'antd';
import {useHistory} from 'react-router';
import background from "./../assets/img/login-background-image.png";
import { Link } from 'react-router-dom';
import UserContext from "./../contexts/UserContext";
import API from './../api'
import { useGoogleReCaptchaV2 } from 'react-google-recaptcha-hooks'
const {Title} = Typography;

const UserLogin = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(UserContext);

  const {
    ReCaptchaBadge,
    executeReCaptcha,
    resetReCaptcha
  } = useGoogleReCaptchaV2({
    siteKey: 'test-deneme-123',
    language: 'tr'
  })

    const handeCaptcha = async () => {
      const token = await executeReCaptcha()
  
      setTimeout(() => {
        resetReCaptcha()
      }, 3000)
    }

    const handleSubmit = (values) => {
      console.log(values);
      setLoading(true);
      const user = {
        Email: values.email,
        Password: values.password,
      };
      API.post(`User/authenticate`, user)
        .then((res) => {
          localStorage.setItem("auth_token", res.data);
          message.success('Başarıyla Giriş Yaptınız!');
          setIsLoggedIn(true);
          setLoading(false);
          history.push('/');
        })
        .catch((error) => {
         message.error(error.response.data);
         setLoading(false);
        });
    }

    const layout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

return (
    <div style={{marginTop:70, 
          backgroundImage: `url(${background})`, 
          backgroundRepeat: 'no-repeat',
          height: '974px',
          backgroundSize: 'cover'}}>
        <Row>
          <Col span={23}>
            <Title style={{textAlign: 'center'}} level={2}>
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
          onFinish={handleSubmit}>

            <Form.Item name="email" label="Email" 
                  rules={[{
                    type: 'email', message: 'Email Adresinizi Doğru Formatta Değil!',
                  }, {
                    required: true, message: 'Lütfen Email Adresi Giriniz',
                  }]}
            >
            <Input placeholder="Lütfen Email Giriniz" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Lütfen Şifrenizi Giriniz' }]}
            >
                <Input.Password placeholder="Lütfen Şifrenizi Giriniz"/>
            </Form.Item>

            <Form.Item style={{ marginBottom: 8 }} wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                <Checkbox>Beni Hatırla</Checkbox>
            </Form.Item>
            
            <Form.Item>
              {ReCaptchaBadge}
              <button onClick={handeCaptcha}>Click</button>
            </Form.Item>
            <Form.Item  wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              <Button type="primary" loading={loading} htmlType="submit">Login</Button>
            </Form.Item>
            <Form.Item  wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
              Henüz Üye Değilmisin? <Link to="/signUp">Üye Ol</Link>
            </Form.Item>

          </Form>
          </Col>
        </Row>
          
    </div>
  );
}
export default UserLogin;