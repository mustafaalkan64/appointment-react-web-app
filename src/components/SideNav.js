import React, { useContext } from "react";
import { Menu } from "antd";
import UserContext from "./../contexts/UserContext";

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
  const { setIsLoggedIn, setToken } = useContext(UserContext);

  const handleMyActiveAppointments = () => {
    history.push("/myActiveAppointments");
  };
  const handleMyCanceledAppointments = () => {
    history.push("/myCanceledAppointments");
  };
  const handleMyPersonelInformations = () => {
    history.push("/myPersonelInformations");
  };
  const handleChangeMyPassword = () => {
    history.push("/changeMyPassword");
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
          <Menu.Item key="6">Yaklaşan Randevularım</Menu.Item>
          <Menu.Item key="7">Geçmiş Randevularım</Menu.Item>
        </SubMenu>

        <SubMenu
          key="subAccount"
          icon={<UserOutlined />}
          title={<span>Hesap Ayarları</span>}
        >
          <Menu.Item key="8" onClick={handleMyPersonelInformations}>
            Kullanıcı Bilgilerim
          </Menu.Item>
          <Menu.Item key="9" onClick={handleChangeMyPassword}>
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
