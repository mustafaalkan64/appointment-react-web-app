import React from "react";
import { Button, Layout } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-t1.svg";
const { Header } = Layout;

const MainHeader = () => {

    return (
        <div>
            <Header className="header" style={{ backgroundColor: "#1890ff" }}>
                <div className="logo">
                    <img src={logo} style={{
                        float: "left",
                        width: "202px",
                        height: "75px"
                    }} />
                </div>
                <div style={{
                    float: "right"
                }}>
                    <Link style={{ color: "white", marginRight: 10 }} to="/login">Giriş Yap</Link>
                    <Button style={{ color: "#d46b08", borderColor: "#d46b08" }}>Üye Ol</Button>
                </div>
            </Header>
        </div>
    );
};
export default MainHeader;
