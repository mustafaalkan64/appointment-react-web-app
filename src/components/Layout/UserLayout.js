import React, { useState, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import BreadCrumbContext from "../../contexts/BreadcrumbContext";
import MyActiveAppointments from "../../components/User/myActiveAppointments";
import MyCanceledAppointments from "../../components/User/MyCanceledAppointments";
import MyPreviousAppointments from "../../components/User/MyPreviousAppointments";
import MyOncomingAppointments from "../../components/User/MyOncomingAppointments";
import AppointmentPlan from "../Shop/AppointmentPlan";
import ShopServices from "../Shop/ShopServices";
import ShopCategories from "../Shop/ShopCategories";
import UserProfile from "../../components/User/UserProfile";
import ForgotPassword from "../LoginPages/ForgotPassword";
import ResetPassword from "../LoginPages/ResetPassword";
import UserRegister from "../LoginPages/UserRegister";
import ShopRegister from "../LoginPages/ShopRegister";
import UserLogin from "../LoginPages/UserLogin";
import NoMatch from "../../components/Common/NoMatch";
import Home from "../../components/User/UserHome";
import SideNav from "./SideNav";
import LayoutHeader from "./LayoutHeader";
import ChangeMyPassword from "../Common/ChangeMyPassword";
import UserSettings from "../User/UserSettings";
import { Layout, Breadcrumb } from "antd";

const { Sider, Content } = Layout;

export default function UserLayout() {
  const { isLoggedIn, token } = useContext(UserContext);
  const { firstBreadcrumb, secondBreadcrumb, lastBreadcrumb } = useContext(
    BreadCrumbContext
  );

  const [collapsed, setCollapse] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapse(collapsed);
  };

  return (
    <div>
      <Switch>
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
              <Layout>
                <Sider
                  collapsible
                  collapsed={collapsed}
                  onCollapse={onCollapse}
                >
                  <SideNav />
                </Sider>
                <Layout>
                  <LayoutHeader />

                  <Content
                    style={{
                      margin: "24px 16px",
                      padding: 24,
                      minHeight: "calc(100vh - 114px)",
                      background: "#fff",
                    }}
                  >
                    <Breadcrumb style={{ margin: "16px 0" }}>
                      <Breadcrumb.Item>{firstBreadcrumb}</Breadcrumb.Item>
                      <Breadcrumb.Item>{secondBreadcrumb}</Breadcrumb.Item>
                      <Breadcrumb.Item>{lastBreadcrumb}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Switch>
                      <Route path="/" exact component={Home} />
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
                      <Route path="*">
                        <NoMatch />
                      </Route>
                    </Switch>
                  </Content>
                </Layout>
              </Layout>
            ) : (
              <UserLogin />
            )
          }
        />
      </Switch>
    </div>
  );
}
