import React, { useContext } from 'react'
import UserContext from "../../contexts/UserContext";
import ShopAppointmentCalender from '../Shop/ShopAppointmentCalender';
import MyAppointments from './MyAppointments';

export default function UserHome() {
    const { userRole } = useContext(UserContext);
    return (
        <div>
            {userRole === "Shop" ? (<ShopAppointmentCalender></ShopAppointmentCalender>) : (<div></div>)}
        </div>
    )
}
