import React from 'react'
import MyAppointments from './MyAppointments'

export default function myCanceledAppointments() {
    return (
        <div>
            <MyAppointments isCanceled={true}></MyAppointments>
        </div>
    )
}
