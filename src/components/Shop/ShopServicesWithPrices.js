import React, { useState, useEffect, useContext } from "react";
import { message, Row, Button, Col, Spin, Card, Table, Input, InputNumber, Popconfirm, Form, Typography } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ShopServicesWithPrices = () => {
    const history = useHistory();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const token = localStorage.getItem("auth_token");
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const {
        setFirstBreadcrumb,
        setSecondBreadcrumb,
        setLastBreadcrumb,
    } = useContext(BreadCrumbContext);

    useEffect(() => {
        const getServices = async () => {
            setLoading(true);
            await API.get(`services/getServicesByShopId`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    debugger;
                    setServices(res.data);
                    setData(res.data);
                    setLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        history.push("/login");
                    } else {
                        message.error(error.response.data);
                    }
                    setLoading(false);
                });
        };

        getServices();
        setFirstBreadcrumb("Anasayfa");
        setSecondBreadcrumb("Ayarlar");
        setLastBreadcrumb("Fiyatlar");
    }, [
        history,
        setFirstBreadcrumb,
        setLastBreadcrumb,
        setSecondBreadcrumb,
        token,
    ]);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            serviceName: '',
            price: '',
            minPrice: '',
            maxPrice: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                const updateServicePriceModel = {
                    Price: row.price,
                    MaxPrice: row.maxPrice,
                    MinPrice: row.minPrice,
                    SaloonServiceId: item.shopServiceId

                };
                setLoading(true);
                API.put(`services/updateServicePrice`, updateServicePriceModel, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((res) => {
                        message.success("Başarıyla Güncellediniz!");
                        setData(newData);
                        setEditingKey('');
                        setLoading(false);
                    })
                    .catch((error) => {
                        if (error.response !== undefined) {
                            if (error.response.status == 400) {
                                message.error(
                                    "Lütfen Fiyat Formatlarını Doğru Giriniz"
                                );
                            }
                            else {
                                message.error(error.response.data);
                            }

                        } else {
                            message.error(
                                "Güncelleme Esnasında Hata ile Karşılaşıldı!"
                            );
                        }
                        setLoading(false);
                    });

            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'shopServiceId',
            key: 'shopServiceId',
        },
        {
            title: 'Hizmet',
            dataIndex: 'serviceName',
            key: 'serviceName',
        },
        {
            title: 'Fiyat',
            dataIndex: 'price',
            key: 'price',
            editable: true,
            sorter: {
                compare: (a, b) => a.price - b.price,
                multiple: 3,
            },

        },
        {
            title: 'Min Fiyat',
            dataIndex: 'minPrice',
            key: 'minPrice',
            editable: true,
            sorter: {
                compare: (a, b) => a.minPrice - b.minPrice,
                multiple: 2,
            },
        },
        {
            title: 'Max Fiyat',
            dataIndex: 'maxPrice',
            key: 'maxPrice',
            editable: true,
            sorter: {
                compare: (a, b) => a.maxPrice - b.maxPrice,
                multiple: 1,
            },

        },
        {
            title: 'İşlemler',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Kaydet
                  </a>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>İptal Et</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Düzenle
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <Row>
                <Col span={20} offset={2}>
                    <Card
                        title="Hizmet Fiyatları"
                        hoverable
                        bordered={true}
                        style={cardStyle}
                        headStyle={headStyle}
                    >
                        <Form form={form} component={false}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                bordered
                                dataSource={data}
                                columns={mergedColumns}
                                rowClassName="editable-row"
                                pagination={{
                                    onChange: cancel,
                                }}
                            />
                        </Form>

                        {/* <Spin spinning={loading} delay={500}>
                            <Table dataSource={services} columns={columns} />
                        </Spin> */}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ShopServicesWithPrices;