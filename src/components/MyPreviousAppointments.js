import React from "react";
import MyAppointments from "./MyAppointments";

export default function myPreviousAppointments() {
  return (
    <div>
      <MyAppointments
        status={2}
        header={"Geçmiş Randevularım"}
      ></MyAppointments>
    </div>
  );
}
