import React, { useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import UserContext from "./../contexts/UserContext";
import BreadCrumbContext from "./../contexts/BreadcrumbContext";
import MyActiveAppointments from "./myActiveAppointments";
import MyCanceledAppointments from "./MyCanceledAppointments";
import MyPreviousAppointments from "./MyPreviousAppointments";
import MyOncomingAppointments from "./MyOncomingAppointments";
import CreateAppointment from "./CreateAppointment";
import MyPersonelInformations from "./MyPersonelInformations";
import UserRegister from "./UserRegister";
import UserLogin from "./UserLogin";
import NoMatch from "./NoMatch";
import Home from "./UserHome";
import SideNav from "./SideNav";
import LayoutHeader from "./LayoutHeader";
import ChangeMyPassword from "./ChangeMyPassword";
import UserSettings from "./UserSettings";
import { Layout, Breadcrumb } from "antd";
import myOncomingAppointments from "./MyOncomingAppointments";

const { Sider, Content } = Layout;

export default function UserLayout() {
  const { isLoggedIn, token } = useContext(UserContext);
  const { firstBreadcrumb, secondBreadcrumb, lastBreadcrumb } = useContext(
    BreadCrumbContext
  );

  const [collapsed, setCollapse] = useState(false);
  useEffect(() => {}, []);

  const onCollapse = (collapsed) => {
    setCollapse(collapsed);
  };

  return (
    <div>
      <Switch>
        <Route exact path="/login" component={UserLogin} />
        <Route exact path="/signup" component={UserRegister} />
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
                        component={MyPersonelInformations}
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
                        path="/createAppointment"
                        component={CreateAppointment}
                      />
                      <Route
                        path="/myPersonelInformations"
                        component={MyPersonelInformations}
                      />
                      <Route
                        path="/myOncomingAppointments"
                        component={MyOncomingAppointments}
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
