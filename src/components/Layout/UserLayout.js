import React, { useState, useContext, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import MyActiveAppointments from "../../components/User/myActiveAppointments";
import MyCanceledAppointments from "../../components/User/MyCanceledAppointments";
import MyPreviousAppointments from "../../components/User/MyPreviousAppointments";
import MyOncomingAppointments from "../../components/User/MyOncomingAppointments";
import AppointmentPlan from "../Shop/AppointmentPlan";
import ShopServices from "../Shop/ShopServices";
import ShopProfile from "../Shop/ShopProfile";
import ShopImages from "../Shop/ShopImages";
import ShopNotifications from "../Shop/ShopNotifications";
import ShopCategories from "../Shop/ShopCategories";
import UserProfile from "../../components/User/UserProfile";
import ForgotPassword from "../LoginPages/ForgotPassword";
import ResetPassword from "../LoginPages/ResetPassword";
import UserRegister from "../LoginPages/UserRegister";
import ShopRegister from "../LoginPages/ShopRegister";
import UserLogin from "../LoginPages/UserLogin";
import NoMatch from "../../components/Common/NoMatch";
import Home from "../../components/Common/Home";
import SideNav from "./SideNav";
import LayoutHeader from "./LayoutHeader";
import ChangeMyPassword from "../Common/ChangeMyPassword";
import UserSettings from "../User/UserSettings";
import { Layout, Breadcrumb } from "antd";
import ShopAppointmentCalender from "../Shop/ShopAppointmentCalender";
import SaloonPersonels from "../Shop/SaloonPersonels";
import SaveSaloonPersons from "../Shop/SaveSaloonPerson";
import SaloonPage from "../Common/SaloonPage";
import Comments from "../Admin/Comments"
import API from "../../api";


const { Sider, Content } = Layout;

export default function UserLayout() {
  const { isLoggedIn, token, userRole, setUsername, setUserRole, setCurrentShop, setIsLoggedIn } = useContext(UserContext);
  const { firstBreadcrumb, secondBreadcrumb, lastBreadcrumb } = useContext(
    BreadCrumbContext
  );

  const [collapsed, setCollapse] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapse(collapsed);
  };

  useEffect(() => {
    setIsLoggedIn(false);
    const getCurrentUser = async () => {
      await API.get(`user/getCurrentUserName`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setUsername(res.data);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    };

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

    const getCurrentShop = async () => {
      await API.get(`user/currentShop`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          setCurrentShop(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getCurrentUser();
    getCurrentUserRole();
    getCurrentShop();
  }, [setUsername, token, setUserRole, setCurrentShop, setIsLoggedIn]);

  return (
    <div>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route exact path="/saloonDetail/:saloonUrl/:saloonId" component={SaloonPage} />
        <Route exact path="/login" component={UserLogin} />
        <Route exact path="/signup" component={UserRegister} />
        <Route exact path="/shopSignup" component={ShopRegister} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route
          exact
          path="/resetPassword/:verify_token"
          component={ResetPassword}
        />
        <Route
          path="/"
          render={() =>
            isLoggedIn || token != null ? (
              <Layout style={{ minHeight: '100vh' }}>
                <Sider
                  collapsible
                  collapsed={collapsed}
                  onCollapse={onCollapse}
                >
                  <SideNav />
                </Sider>
                <Layout className="site-layout" style={{ height: "100%", }}>
                  <LayoutHeader />

                  <Content
                    style={{ margin: '0 16px' }}
                  // style={{
                  //   margin: "24px 16px",
                  //   padding: 24,
                  //   minHeight: "calc(100vh - 114px)",
                  //   background: "background: rgb(230 230 230)",
                  // }}
                  >
                    <Breadcrumb style={{ margin: "16px 0" }}>
                      <Breadcrumb.Item>{firstBreadcrumb}</Breadcrumb.Item>
                      <Breadcrumb.Item>{secondBreadcrumb}</Breadcrumb.Item>
                      <Breadcrumb.Item>{lastBreadcrumb}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Switch>
                      {userRole === "User" ? (<Route path="/" exact component={MyActiveAppointments} />) : (<Route path="/" exact component={ShopAppointmentCalender} />)}
                      <Route
                        path="/myPersonelInformations"
                        component={UserProfile}
                      />
                      {/* <Route path="/myPersonelInformations/:id" component={MyPersonelInformations} /> */}
                      <Route
                        path="/myActiveAppointments"
                        component={MyActiveAppointments}
                      />
                      <Route
                        path="/MyCanceledAppointments"
                        component={MyCanceledAppointments}
                      />
                      <Route
                        path="/MyPreviousAppointments"
                        component={MyPreviousAppointments}
                      />
                      <Route
                        path="/appointmentPlan"
                        component={AppointmentPlan}
                      />
                      <Route path="/userProfile" component={UserProfile} />
                      <Route path="/comments" component={Comments} />
                      <Route path="/shopProfile" component={ShopProfile} />
                      <Route path="/shopImages" component={ShopImages} />
                      <Route path="/saloonPersons" component={SaloonPersonels} />
                      <Route path="/savePersonel/:personId" component={SaveSaloonPersons} />
                      <Route path="/shopNotifications" component={ShopNotifications} />
                      <Route
                        path="/myOncomingAppointments"
                        component={MyOncomingAppointments}
                      />
                      <Route path="/shopServices" component={ShopServices} />
                      <Route
                        path="/shopCategories"
                        component={ShopCategories}
                      />
                      <Route
                        path="/changeMyPassword"
                        component={ChangeMyPassword}
                      />
                      <Route path="/userSettings" component={UserSettings} />
                      <Route path="/shopAppointmentCalender" component={ShopAppointmentCalender} />
                      <Route path="*">
                        <NoMatch />
                      </Route>
                    </Switch>
                  </Content>
                </Layout>
              </Layout>
            ) : (
              <Home />
            )
          }
        />
      </Switch>
    </div>
  );
}
