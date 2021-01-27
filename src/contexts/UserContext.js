import React, { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("User");
  const [userNameSurname, setUserNameSurname] = useState("");
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
    userNameSurname,
    setUserNameSurname,
  };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContext;
