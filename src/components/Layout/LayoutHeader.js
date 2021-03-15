import React, { useContext, useEffect } from "react";
import { Menu, Layout } from "antd";
import UserContext from "../../contexts/UserContext";
import { SettingFilled } from "@ant-design/icons";
import { useHistory } from "react-router";

const { SubMenu } = Menu;
const { Header } = Layout;

export default function LayoutHeader() {
  const {
    setIsLoggedIn,
    setToken,
    username,
    userRole,
    setUsername,
  } = useContext(UserContext);
  const history = useHistory();

  const handleUserProfile = () => {
    history.push("/userProfile");
  };
  const handleShopProfile = () => {
    history.push("/shopProfile");
  };
  const handleSettings = () => {
    history.push("/userSettings");
  };
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    setToken("");
    setUsername("");
    history.push("/login");
  };

  useEffect(() => {}, []);

  return (
    <div>
      <Header className="header">
        <div className="logo" />

        <Menu
          theme="dark"
          mode="horizontal"
          style={{ float: "right" }}
          defaultSelectedKeys={["2"]}
        >
          <Menu.Item key="deneme">Hoşgeldiniz {username}</Menu.Item>
          <SubMenu key="account" icon={<SettingFilled />}>
            {userRole == "User" ? (
              <Menu.Item key="10" onClick={handleUserProfile}>
                Profilim
              </Menu.Item>
            ) : (
              <Menu.Item key="11" onClick={handleShopProfile}>
                Mağaza Bilgilerim
              </Menu.Item>
            )}
            <Menu.Item onClick={handleSettings} key="setting:2">
              Ayarlar
            </Menu.Item>
            <Menu.Item onClick={handleLogout} key="setting:3">
              Çıkış
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Header>
    </div>
  );
}
