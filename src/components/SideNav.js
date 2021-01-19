import React, {useContext} from 'react';
import { Menu } from 'antd';
import UserContext from "./../contexts/UserContext";

import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
  } from '@ant-design/icons';
import {useHistory}  from 'react-router';
const SideNav = () => {
    const history = useHistory();
    const { setIsLoggedIn } = useContext(UserContext);
    
        const handleCreateAppointmentClick = () => {
                history.push('/createAppointment');
            }
        const handleMyActiveAppointments = () => {
                history.push('/myActiveAppointments');
            }
        const handleMyCanceledAppointments = () => {
                history.push('/myCanceledAppointments');
            }
        const handleMyPersonelInformations = () => {
                history.push('/myPersonelInformations');
            }
        const handeLogout = () => {
                localStorage.removeItem("auth_token");
                setIsLoggedIn(false);
                history.push('/');
            }
return (
      <div>
        <div style={{height: "32px", background: "rgba(255, 255, 255, 0.2)", margin: "16px"}}></div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" onClick={handleCreateAppointmentClick}>
                    <UserOutlined />
                    <span> Randevu Oluştur</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={handleMyActiveAppointments}>
                    <VideoCameraOutlined />
                    <span> Aktif Randevularım</span>
                </Menu.Item>
                <Menu.Item key="3" onClick={handleMyCanceledAppointments}>
                    <UploadOutlined />
                    <span> İptal Ettiğim Randevularım</span>
                </Menu.Item>
                <Menu.Item key="4" onClick={handleMyPersonelInformations}>
                    <UploadOutlined />
                    <span>Kişisel Bilgilerim</span>
                </Menu.Item>
                <Menu.Item key="5" onClick={handeLogout}>
                    <UploadOutlined />
                    <span>Çıkış</span>
                </Menu.Item>
            </Menu>
        </div>
  );
}
export default SideNav;