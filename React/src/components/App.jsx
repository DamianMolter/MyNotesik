import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AuthContainer from "./AuthContainer";
import useToken from './useToken';

function App() {
  const {token, setToken}  = useToken();

  const [loggedUserId, setLoggedUserId] = useState(-1);
  const [loggedUserEmail, setLoggedUserEmail] = useState("");

  if (!token) {
    return (
      <div>
        <Header />
        <AuthContainer
          setToken={setToken}
          setLoggedUserId={setLoggedUserId}
          setLoggedUserEmail={setLoggedUserEmail}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                loggedUserId={loggedUserId}
                loggedUserEmail={loggedUserEmail}
                setLoggedUserId={setLoggedUserId}
                setLoggedUserEmail={setLoggedUserEmail}
                setToken={setToken}
              />
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
