import React, { useContext, useEffect, useState } from "react";
import { Menu, message, notification, Image, Skeleton } from "antd";
import API from "../../api";
import UserContext from "../../contexts/UserContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { appointmentHub } from "../../constUrls";
import { imageUrlDirectory } from "../../constUrls";

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
  const {
    setIsLoggedIn,
    setToken,
    userRole,
    currentShop,
    token,
  } = useContext(UserContext);
  // const token = localStorage.getItem("auth_token");
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const connect = new HubConnectionBuilder()
  //     .withUrl(appointmentHub)
  //     .withAutomaticReconnect()
  //     .build();

  //   try {
  //     connect.start();
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   connect.on("broadcastMessage", (appointmentId, cancelText, shopId) => {
  //     if (String(currentShop) === shopId) {
  //       notification.open({
  //         message: "Randevu İptal Bildirimi!",
  //         description: `${cancelText} nedeniyle iptal edilmiştir!`,
  //       });
  //     }
  //   });

  // }, [currentShop]);

  useEffect(() => {
    if (userRole === "Shop") {
      setLoading(true);
      const getShopLogo = async () => {
        await API.get(`shop/getShopLogo`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setLogo(imageUrlDirectory + res.data);
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
      getShopLogo();
    }
  }, [
    history,
    token,
    userRole
  ]);

  const handleMyActiveAppointments = () => {
    history.push("/myActiveAppointments");
  };
  const handleCreateNewAppointmentPlan = () => {
    history.push("/saveAppointmentPlan/0");
  };
  const handleAppointmentPlanList = () => {
    history.push("/appointmentPlanList");
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
  const handleShopServices = () => {
    history.push("/shopServices");
  };
  const handleShopCategories = () => {
    history.push("/shopCategories");
  };
  const handleShopImages = () => {
    history.push("/shopImages");
  };
  const handleShopNotifications = () => {
    history.push("/shopNotifications");
  };
  const handleMyOncomingAppointments = () => {
    history.push("/myOncomingAppointments");
  };
  const handleAppointmentCalender = () => {
    history.push("/shopAppointmentCalender");
  }
  const handleComments = () => {
    history.push("/comments");
  }
  const redirectHomePage = () => {
    history.push("/");
  };
  const handlePersons = () => {
    history.push("/saloonPersons");
  }
  const handleServicePrices = () => {
    history.push("/servicePrices");
  }
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
          margin: "14px",
        }}
      > {userRole === "Shop" ? (loading ? (<Skeleton.Image style={{ height: 40 }} />) : (<Image height="40px" src={logo} />)) : (<div><Image height="40px" src={imageUrlDirectory + "empty-img.png"} /></div>)}

      </div>

      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" icon={<HomeOutlined />} onClick={redirectHomePage}>
          <span>Ana Sayfa</span>
        </Menu.Item>

        {userRole === "User" ? (
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
          <>
            {userRole === "Shop" ? (
              <SubMenu
                key="subAppointments"
                icon={<CheckSquareOutlined />}
                title={<span>Randevu Bilgilerim</span>}
              >
                <Menu.Item key="8" onClick={handleCreateNewAppointmentPlan}>
                  Yeni Randevu Planı Oluştur
              </Menu.Item>
                <Menu.Item key="21" onClick={handleAppointmentPlanList}>
                  Randevu Planlarım
              </Menu.Item>
                <Menu.Item key="9" onClick={handleAppointmentCalender}>
                  Randevu Takvimim
              </Menu.Item>
              </SubMenu>) : (<></>)}</>
        )}
        <SubMenu
          key="subAccount"
          icon={<UserOutlined />}
          title={userRole === "User" ? (<span>Kullanıcı Bilgilerim</span>) : (<>{userRole === "Shop" ? (<span>Salon Bilgilerim</span>) : (<span>Admin Profil</span>)}</>)}
        >
          {userRole === "User" ? (
            <Menu.Item key="10" onClick={handleUserProfile}>
              Profilim
            </Menu.Item>
          ) : (
            <>
              {userRole === "Shop" ? (
                <>
                  <Menu.Item key="11" onClick={handleShopProfile}>
                    Salon Profilim
                  </Menu.Item>
                  <Menu.Item key="12" onClick={handleShopServices}>
                    Verdiğim Hizmetler
                  </Menu.Item>
                  <Menu.Item key="21" onClick={handleServicePrices}>
                    Fiyatlandırma
                  </Menu.Item>
                  <Menu.Item key="13" onClick={handleShopCategories}>
                    Kategorilerim
                  </Menu.Item>
                  <Menu.Item key="14" onClick={handleShopImages}>
                    Fotoğraflarım
                  </Menu.Item>
                  <Menu.Item key="15" onClick={handleShopNotifications}>
                    Bildirimlerim
                  </Menu.Item>
                  <Menu.Item key="16" onClick={handlePersons}>
                    Personellerim
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item key="20" onClick={handleUserProfile}>
                    Profilim
                  </Menu.Item>
                  <Menu.Item key="19" onClick={handleComments}>
                    Yorumlar
                  </Menu.Item>
                </>)
              }
            </>
          )}

          <Menu.Item key="17" onClick={handleChangeMyPassword}>
            Şifre Değiştir
          </Menu.Item>
        </SubMenu>
        <Menu.Item icon={<LogoutOutlined />} key="18" onClick={handleLogout}>
          <span>Çıkış</span>
        </Menu.Item>
      </Menu>
    </div>
  );
};
export default SideNav;
