import React, { useContext, useEffect, useState } from "react";
import { Menu, Layout, Badge, message, Dropdown, Typography } from "antd";
import UserContext from "../../contexts/UserContext";
import { SettingFilled, NotificationOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { appointmentHub } from "../../constUrls";
import API from "../../api";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";



const { SubMenu } = Menu;
const { Header } = Layout;
const { Text } = Typography;



export default function LayoutHeader() {
  const {
    setIsLoggedIn,
    setToken,
    username,
    userRole,
    setUsername,
    currentShop,
    setCurrentShop,
  } = useContext(UserContext);

  const history = useHistory();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [notReadNotificationCount, setNotReadNotificationCount] = useState(0);
  const token = localStorage.getItem("auth_token");

  const onClick = ({ key }) => {
    if (location.pathname === "/shopNotifications") {
      window.location.reload();
    }
    else {
      history.push("/shopNotifications");
    }

    API.put(`notifications/updateNotificationsAsRead`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setNotReadNotificationCount(0);


      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  useEffect(() => {

    const connect = new HubConnectionBuilder()
      .withUrl(appointmentHub)
      .withAutomaticReconnect()
      .build();

    try {
      connect.start();
    } catch (err) {
      console.log(err);
    }

    connect.on("broadcastMessage", (appointmentId, cancelText, shopId) => {
      if (String(currentShop) === shopId) {
        getNotReadShopNotificationsCount();
        getShopNotifications();
      }
    });

    const getShopNotifications = async () => {
      await API.get(`notifications/getTop5Notifications`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setNotifications(res.data);
        })
        .catch((error) => {
          message.error("Bildirimleri Getirme Esnasında Hata ile Karşılaşıldı");
        });
    };

    const getCurrentShop = async () => {
      await API.get(`user/currentShop`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setCurrentShop(res.data);
          console.log(currentShop);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getNotReadShopNotificationsCount = async () => {
      await API.get(`notifications/getNotReadShopNotificationsCount`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setNotReadNotificationCount(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getShopNotifications();
    getCurrentShop();
    getNotReadShopNotificationsCount();
  }, [currentShop, history, setCurrentShop, token, setNotifications, setNotReadNotificationCount
  ]);

  const menu = (
    <Menu onClick={onClick}>
      {notifications.map((notificaion, key) => {
        return (
          <Menu.Item key={key} icon={<NotificationOutlined />}>
            <Text >{notificaion.shortNotificationText}</Text>
          </Menu.Item>
        );
      })}
      <Menu.Item key={"allNotications"}>
        <Link style={{ color: "#1890ff" }} to="/shopNotifications">Tüm Bildirimler</Link>
      </Menu.Item>
    </Menu >
  );


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
          <Menu.Item key="menukey">Hoşgeldiniz {username}</Menu.Item>
          <Dropdown overlay={menu}>
            <Badge count={notReadNotificationCount} dot onClick={e => e.preventDefault()}>
              <NotificationOutlined style={{ color: "white" }} />
            </Badge>
          </Dropdown>
          <SubMenu key="account" icon={<SettingFilled />}>
            {userRole === "User" ? (
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
