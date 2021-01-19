
import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./../contexts/UserContext"
import UserLayout from './UserLayout';

function App () {

return(
  <UserProvider>
     <Router>
       <UserLayout></UserLayout>
     </Router>
  </UserProvider>
 );
};

export default App;
