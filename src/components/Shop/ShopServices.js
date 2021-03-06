import React, { useState, useEffect, useContext } from "react";
import { TreeSelect, message, Row, Button, Col } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";

const ShopServices = () => {
  const history = useHistory();
  const { SHOW_PARENT, SHOW_ALL } = TreeSelect;
  const [serviceIds, setServiceIds] = useState(undefined);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("auth_token");
  const {
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
  } = useContext(BreadCrumbContext);

  useEffect(() => {
    const getServicesTree = async () => {
      setLoading(true);
      await API.get(`categories/getServicesTree`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setLoading(false);
          setTreeData(res.data);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            history.push("/login");
            message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
          } else {
            message.error(
              "Kişisel Bilgileri Getirme Esnasında Hata ile Karşılaşıldı!"
            );
          }
        });
    };
    getServicesTree();
    setFirstBreadcrumb("Anasayfa");
    setSecondBreadcrumb("Ayarlar");
    setLastBreadcrumb("Hizmetler");
  }, []);

  const submitChangins = async () => {
    debugger;
    await API.put(`shop/updateShopServices`, serviceIds, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setLoading(false);
        message.success(res.data.response);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          history.push("/login");
          message.error("Bu İşlemi Yapmaya Yetkiniz Yok!");
        } else {
          message.error(
            "Kişisel Bilgileri Getirme Esnasında Hata ile Karşılaşıldı!"
          );
        }
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
    showCheckedStrategy: SHOW_ALL,
    treeIcon: true,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };

  return (
    <div>
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
            loading={loading}
            onClick={() => submitChangins()}
            htmlType="button"
          >
            Kaydet
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ShopServices;
