import React, {useState, useEffect, useContext} from 'react';
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
import { Layout } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  } from '@ant-design/icons';
const { Header, Sider, Content} = Layout;

export default function UserLayout() {

  const { isLoggedIn } = useContext(UserContext);

    const handleToggle = (event) => {
        event.preventDefault();
        collapse1 ? setCollapse(false) : setCollapse(true);
    }

    const [collapse1, setCollapse] = useState(false);
    useEffect(() => {
        window.innerWidth <= 760 ? setCollapse(true) : setCollapse(false);
      }, []);


    return (
        <div>
          <Switch>
                <Route exact path='/login' component={UserLogin} />
                <Route exact path='/signup' component={UserRegister} />
                <Route path='/' render={() => (
                    isLoggedIn ? 
                    (
                      <Layout>
                      <Sider trigger={null} collapsible collapsed={collapse1}>
                        <SideNav />
                      </Sider>
                      <Layout>
                        <Header className="siteLayoutBackground" style={{padding: 0, background: "#001529"}}>
                                  {React.createElement(collapse1 ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                      className: 'trigger',
                                      onClick: handleToggle,
                                      style: {color: "#fff"}
                                  })}
                        </Header>
                          <Content style={{margin: '24px 16px', padding: 24, minHeight: "calc(100vh - 114px)", background: "#fff"}}>
                            <Switch>
                                <Route path="/" exact component={Home} />
                                {/* <Route path="/myAppointments/:type" component={MyAppointments} /> */}
                                <Route path="/myActiveAppointments" component={MyActiveAppointments} />
                                <Route path="/MyCanceledAppointments" component={MyCanceledAppointments} />
                                <Route path="/createAppointment" component={CreateAppointment} />
                                <Route path="/myPersonelInformations" component={MyPersonelInformations} />
                                <Route path="*">
                                  <NoMatch />
                                </Route>
                            </Switch>
                          </Content>
                      </Layout>
                    </Layout>
                  ) : 
                  (
                    <UserLogin />
                )
                )} />
            </Switch>
          
        </div>
    )
}
