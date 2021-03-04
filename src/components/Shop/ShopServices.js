import React, { useState, useEffect, useContext } from "react";
import { TreeSelect, message } from "antd";
import { useHistory } from "react-router";
import API from "../../api";
import "moment/locale/tr";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";

const ShopServices = () => {
  const history = useHistory();
  const { SHOW_PARENT } = TreeSelect;
  const [value, setValue] = useState(undefined);
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

  const onChange = (value) => {
    console.log("onChange ", value);
    setValue(value);
  };

  const tProps = {
    treeData,
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };

  return <TreeSelect {...tProps} />;
};

export default ShopServices;
