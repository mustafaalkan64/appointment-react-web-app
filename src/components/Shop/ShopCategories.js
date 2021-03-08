import React, { useState, useEffect, useContext } from "react";
import { TreeSelect, message, Row, Button, Col, Spin, Typography } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";

const ShopCategories = () => {
  const history = useHistory();
  const { Title } = Typography;
  const [categoryIds, setCategoryIds] = useState(undefined);
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
    const getCategoriesTree = async () => {
      setLoading(true);
      await API.get(`shop/getCategoriesTree`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setTreeData(res.data);
          getShopCategories();
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

    const getShopCategories = async () => {
      await API.get(`shop/getShopCategories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setCategoryIds(res.data);
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
    getCategoriesTree();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Ayarlar");
    setLastBreadcrumb("Kategorilerim");
  }, []);

  const submitChangins = async () => {
    setSaveLoading(true);
    await API.put(`shop/updateShopCategories`, categoryIds, {
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
    setCategoryIds(value);
  };

  const tProps = {
    treeData,
    showSearch: true,
    value: categoryIds,
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
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}>Kategorilerim</Title>
        </Col>
      </Row>
      <Spin spinning={loading} delay={500}>
        <Row
          style={{ marginBottom: 10 }}
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          <TreeSelect {...tProps} />
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
    </div>
  );
};

export default ShopCategories;
