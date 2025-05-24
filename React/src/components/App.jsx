import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AuthContainer from "./AuthContainer";

function App() {
  const [token, setToken] = useState("");
  const [loggedUserId, setLoggedUserId] = useState(-1);

  if (!token && loggedUserId < 0) {
    return (
      <div>
        <Header />
        <AuthContainer setToken={setToken} setLoggedUserId={setLoggedUserId}/>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard loggedUserId = {loggedUserId}/>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
