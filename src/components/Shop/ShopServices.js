import React, { useState, useEffect, useContext } from "react";
import { TreeSelect, message, Row, Button, Col, Spin, Card } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import { cardStyle, headStyle } from "../../assets/styles/styles";

const ShopServices = () => {
  const history = useHistory();
  const [serviceIds, setServiceIds] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const token = localStorage.getItem("auth_token");
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);

  useEffect(() => {
    const getServicesTree = async () => {
      setLoading(true);
      await API.get(`shop/getServicesTree`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setTreeData(res.data);
          getShopServices();
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

    const getShopServices = async () => {
      await API.get(`shop/getShopServices`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setServiceIds(res.data);
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
    getServicesTree();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Ayarlar");
    setLastBreadcrumb("Hizmetler");
  }, [
    history,
    setFirstBreadcrumb,
    setLastBreadcrumb,
    setSecondBreadcrumb,
    token,
  ]);

  const submitChangins = async () => {
    setSaveLoading(true);
    await API.put(`shop/updateShopServices`, serviceIds, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setSaveLoading(false);
        message.success(res.data.response);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          history.push("/login");
          message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
        } else {
          message.error(error.response.data);
        }
        setSaveLoading(false);
      });
  };

  const onChange = (value) => {
    console.log("onChange ", value);
    setServiceIds(value);
  };

  const tProps = {
    treeData,
    showSearch: true,
    value: serviceIds,
    onChange,
    treeCheckable: true,
    treeIcon: true,
    placeholder: "Lütfen Seçiniz",
    style: {
      width: "100%",
    },
  };

  return (
    <div>
      <Row>
        <Col span={20} offset={2}>
          <Card
            title="Verdiğim Hizmetler"
            hoverable
            bordered={true}
            style={cardStyle}
            headStyle={headStyle}
          >
            <Spin spinning={loading} delay={500}>
              <Row
                style={{ marginBottom: 10 }}
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <TreeSelect {...tProps}
                  filterTreeNode={(search, item) => {
                    return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                  }} />
              </Row>
              <Row style={{ marginLeft: 0 }}>
                <Col>
                  <Button
                    type="primary"
                    loading={saveLoading}
                    onClick={() => submitChangins()}
                    htmlType="button"
                  >
                    Kaydet
                  </Button>
                </Col>
              </Row>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShopServices;
