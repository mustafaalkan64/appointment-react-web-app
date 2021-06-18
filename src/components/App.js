import React from "react";
import { Router } from "react-router-dom";
import { UserProvider } from "./../contexts/UserContext";
import { BreadCrumbProvider } from "./../contexts/BreadcrumbContext";
import UserLayout from "../components/Layout/UserLayout";
// import Home from "../components/Common/Home"
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  return (
    <UserProvider>
      <BreadCrumbProvider>
        <Router history={history}>
          <UserLayout />
        </Router>
      </BreadCrumbProvider>
    </UserProvider>
  );
}

export default App;
