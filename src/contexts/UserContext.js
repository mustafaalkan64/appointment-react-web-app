import React, { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState("User");
  const [username, setUsername] = useState("");
  const [currentShop, setCurrentShop] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const values = {
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    token,
    setToken,
    username,
    setUsername,
    currentShop,
    setCurrentShop,
  };
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContext;
