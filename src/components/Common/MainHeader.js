import React, { useContext } from "react";
import { Button, Layout } from "antd";
import UserContext from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-t1.svg";
import { useHistory } from "react-router";

const { Header } = Layout;


const MainHeader = () => {
    const history = useHistory();
    const register = () => {
        history.push("/signUp")
    }
    const { isLoggedIn, token, username } = useContext(UserContext);
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
                    {isLoggedIn || token != null ? (<div>Hoşgeldiniz {username} <Link style={{ color: "white", marginRight: 10 }} to="/">Yönetim Sayfası</Link> </div>) : (
                        <div> <Link style={{ color: "white", marginRight: 10 }} to="/login">Giriş Yap</Link>
                            <Button style={{ color: "#d46b08", borderColor: "#d46b08" }} onClick={() => register()}>Üye Ol</Button>
                        </div>
                    )
                    }
                </div>
            </Header>

        </div >
    );
};
export default MainHeader;
