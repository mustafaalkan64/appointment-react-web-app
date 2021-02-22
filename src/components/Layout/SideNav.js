import React, { useContext, useEffect } from "react";
import { Menu } from "antd";
import API from "../../api";
import UserContext from "../../contexts/UserContext";

import {
  UserOutlined,
  HomeOutlined,
  CheckSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router";
const { SubMenu } = Menu;

const SideNav = () => {
  const history = useHistory();
  const { setIsLoggedIn, setToken, userRole, setUserRole, token } = useContext(
    UserContext
  );

  useEffect(() => {
    const getCurrentUserRole = async () => {
      await API.get(`user/currentUserRole`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setUserRole(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCurrentUserRole();
  }, []);

  const handleMyActiveAppointments = () => {
    history.push("/myActiveAppointments");
  };
  const handleCreateAppointment = () => {
    history.push("/createAppointment");
  };
  const handleMyCanceledAppointments = () => {
    history.push("/myCanceledAppointments");
  };
  const handleUserProfile = () => {
    history.push("/userProfile");
  };
  const handleShopProfile = () => {
    history.push("/shopProfile");
  };
  const handleChangeMyPassword = () => {
    history.push("/changeMyPassword");
  };
  const handleMyPreviousAppointments = () => {
    history.push("/myPreviousAppointments");
  };
  const handleMyOncomingAppointments = () => {
    history.push("/myOncomingAppointments");
  };
  const redirectHomePage = () => {
    history.push("/");
  };
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    setToken(null);
    history.push("/");
  };
  return (
    <div>
      <div
        style={{
          height: "32px",
          background: "rgba(255, 255, 255, 0.2)",
          margin: "16px",
        }}
      ></div>

      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />} onClick={redirectHomePage}>
          <span>Ana Sayfa</span>
        </Menu.Item>

        {userRole == "User" ? (
          <SubMenu
            key="subAppointments"
            icon={<CheckSquareOutlined />}
            title={<span>Randevu Bilgilerim</span>}
          >
            <Menu.Item key="4" onClick={handleMyActiveAppointments}>
              Aktif Randevularım
            </Menu.Item>
            <Menu.Item key="5" onClick={handleMyCanceledAppointments}>
              İptal Edilen Randevularım
            </Menu.Item>
            <Menu.Item key="6" onClick={handleMyOncomingAppointments}>
              Yaklaşan Randevularım
            </Menu.Item>
            <Menu.Item key="7" onClick={handleMyPreviousAppointments}>
              Geçmiş Randevularım
            </Menu.Item>
          </SubMenu>
        ) : (
          <SubMenu
            key="subAppointments"
            icon={<CheckSquareOutlined />}
            title={<span>Randevu Bilgilerim</span>}
          >
            <Menu.Item key="8" onClick={handleCreateAppointment}>
              Randevu Oluştur
            </Menu.Item>
            <Menu.Item key="9" onClick={handleCreateAppointment}>
              Randevu Defterim
            </Menu.Item>
          </SubMenu>
        )}
        <SubMenu
          key="subAccount"
          icon={<UserOutlined />}
          title={<span>Hesap Ayarları</span>}
        >
          {userRole == "User" ? (
            <Menu.Item key="10" onClick={handleUserProfile}>
              Profilim
            </Menu.Item>
          ) : (
            <Menu.Item key="11" onClick={handleShopProfile}>
              Mağaza Bilgilerim
            </Menu.Item>
          )}
          <Menu.Item key="12" onClick={handleChangeMyPassword}>
            Şifre Değiştir
          </Menu.Item>
        </SubMenu>
        <Menu.Item icon={<LogoutOutlined />} key="10" onClick={handleLogout}>
          <span>Çıkış</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};
export default SideNav;
