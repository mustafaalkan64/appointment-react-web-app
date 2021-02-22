import React from "react";
import MyAppointments from "./MyAppointments";

export default function myActiveAppointments() {
  return (
    <div>
      <MyAppointments status={1} header={"Aktif Randevularım"}></MyAppointments>
    </div>
  );
}
