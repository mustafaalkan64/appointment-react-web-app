import React, { createContext, useState } from "react";

const BreadCrumbContext = createContext(null);

export const BreadCrumbProvider = ({ children }) => {
  const [firstBreadcrumb, setFirstBreadcrumb] = useState("");
  const [secondBreadcrumb, setSecondBreadcrumb] = useState("");
  const [lastBreadcrumb, setLastBreadcrumb] = useState("");

  const values = {
    firstBreadcrumb,
    setFirstBreadcrumb,
    setSecondBreadcrumb,
    setLastBreadcrumb,
    secondBreadcrumb,
    lastBreadcrumb,
  };
  return (
    <BreadCrumbContext.Provider value={values}>
      {children}
    </BreadCrumbContext.Provider>
  );
};

export default BreadCrumbContext;
