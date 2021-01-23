import React from 'react'
import MyAppointments from './MyAppointments'

export default function myActiveAppointments() {
    return (
        <div>
            <MyAppointments isCanceled={false}></MyAppointments>
        </div>
    )
}
