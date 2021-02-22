import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./../contexts/UserContext";
import { BreadCrumbProvider } from "./../contexts/BreadcrumbContext";
import UserLayout from "../components/Layout/UserLayout";

function App() {
  return (
    <UserProvider>
      <BreadCrumbProvider>
        <Router>
          <UserLayout />
        </Router>
      </BreadCrumbProvider>
    </UserProvider>
  );
}

export default App;
