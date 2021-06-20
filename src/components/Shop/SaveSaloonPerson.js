import React, { useState, useContext, useEffect, useCallback } from "react";
import { Form, Input, Row, Col, Button, message, Card, Switch } from "antd";
import { useHistory } from "react-router";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import API from "../../api";
import { cardStyle, headStyle } from "../../assets/styles/styles";
import {
    useParams
} from "react-router-dom";


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const SaveSaloonPersons = () => {

    let { personId } = useParams();
    const [form] = Form.useForm();
    const { token } = useContext(UserContext);
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);



    const onFinish = (values) => {
        console.log("Received values of form: ", values);
        const savePersonModel = {
            PersonId: personId,
            PersonFullName: values.personFullName,
            IsActive: values.isActive,
            SaloonId: 0
        };
        savePerson(savePersonModel);
    };

    const getPersonOfSaloon = useCallback(async (value) => {
        setLoading(true);
        await API.get(`shop/getSaloonPersonelById/${value}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                form.setFieldsValue({
                    personFullName: res.data.personFullName,
                    isActive: res.data.isActive,
                });
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 401) {
                    history.push("/login");
                    message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
                } else {
                    message.error(error.response.data);
                }
            });
    }, [form, history, token]);

    useEffect(() => {
        if (personId > 0) {
            getPersonOfSaloon(personId);
        }
        else {
            form.setFieldsValue({
                personFullName: '',
                isActive: true,
            });
        }
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Profil");
        setLastBreadcrumb("Personel Kaydet");
    }, [setFirstBreadcrumb, setSecondBreadcrumb, setLastBreadcrumb, form, getPersonOfSaloon, personId]);

    const savePerson = async (savePersonModel) => {
        setLoading(true);
        await API.put(`shop/savePerson`, savePersonModel, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                message.success(res.data.response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response.status === 401) {
                    history.push("/login");
                    message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
                } else {
                    message.error(error.response.data);
                }
            });
    };

    return (
        <div>
            <Row>
                <Col span={16} offset={4}>
                    <Card
                        title="Personel Kaydet"
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}
                    >
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="savePersonForm"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <Form.Item
                                name="personFullName"
                                label="Personel"
                                rules={[
                                    {
                                        required: true,
                                        message: "Lütfen Personel Adını Giriniz",
                                    },
                                ]}
                            >
                                <Input placeholder="Personel Ad Soyadı" />
                            </Form.Item>

                            <Form.Item label="Aktiflik" name="isActive" valuePropName="checked">
                                <Switch />
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" loading={loading} htmlType="submit">
                                    Kaydet
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default SaveSaloonPersons;
