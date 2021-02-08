import React from "react";
import MyAppointments from "./MyAppointments";

export default function MyCanceledAppointments() {
  return (
    <div>
      <MyAppointments
        status={0}
        header={"İptal Ettiğim Randevularım"}
      ></MyAppointments>
    </div>
  );
}