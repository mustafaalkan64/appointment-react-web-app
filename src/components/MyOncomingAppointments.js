import React from "react";
import MyAppointments from "./MyAppointments";

export default function myOncomingAppointments() {
  return (
    <div>
      <MyAppointments
        status={3}
        header={"Yaklaşmakta Olan Randevularım"}
      ></MyAppointments>
    </div>
  );
}
