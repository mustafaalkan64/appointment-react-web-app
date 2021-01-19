import React, { createContext, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('User');

	const values = {
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole
	};

	return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContext;