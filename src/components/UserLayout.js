import React, { useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import UserContext from "./../contexts/UserContext";
import MyActiveAppointments from "./myActiveAppointments";
import MyCanceledAppointments from "./myCanceledAppointments";
import CreateAppointment from "./CreateAppointment";
import MyPersonelInformations from "./MyPersonelInformations";
import UserRegister from "./UserRegister";
import UserLogin from "./UserLogin";
import NoMatch from "./NoMatch";
import Home from "./UserHome";
import SideNav from "./SideNav";
import ChangeMyPassword from "./ChangeMyPassword";
import { Layout, Menu, Breadcrumb, Typography } from "antd";
import { UserOutlined, SettingFilled } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

export default function UserLayout() {
  const { isLoggedIn, token } = useContext(UserContext);

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
                  <Header className="header">
                    <div className="logo" />

                    <Menu
                      theme="dark"
                      mode="horizontal"
                      style={{ float: "right" }}
                      defaultSelectedKeys={["2"]}
                    >
                      <Menu.Item key="deneme">
                        Hoşgeldiniz Mustafa ALKAN
                      </Menu.Item>
                      <SubMenu key="account" icon={<SettingFilled />}>
                        <Menu.Item key="setting:1">Hesap Bilgilerim</Menu.Item>
                        <Menu.Item key="setting:2">Ayarlar</Menu.Item>
                        <Menu.Item key="setting:3">Çıkış</Menu.Item>
                      </SubMenu>
                    </Menu>
                  </Header>

                  <Content
                    style={{
                      margin: "24px 16px",
                      padding: 24,
                      minHeight: "calc(100vh - 114px)",
                      background: "#fff",
                    }}
                  >
                    <Breadcrumb style={{ margin: "16px 0" }}>
                      <Breadcrumb.Item>Home</Breadcrumb.Item>
                      <Breadcrumb.Item>List</Breadcrumb.Item>
                      <Breadcrumb.Item>App</Breadcrumb.Item>
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
                        path="/createAppointment"
                        component={CreateAppointment}
                      />
                      <Route
                        path="/myPersonelInformations"
                        component={MyPersonelInformations}
                      />
                      <Route
                        path="/changeMyPassword"
                        component={ChangeMyPassword}
                      />
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
