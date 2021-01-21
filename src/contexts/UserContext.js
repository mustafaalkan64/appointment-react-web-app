import React, { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("User");
  const auth_token = localStorage.getItem("auth_token");
  const [token, setToken] = useState(auth_token);
  const [isLoggedIn, setIsLoggedIn] = useState(
    auth_token == null ? false : true
  );

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    token,
    setToken,
  };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContext;
