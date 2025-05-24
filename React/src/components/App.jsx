import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AuthContainer from "./AuthContainer";

function App() {
  const [token, setToken] = useState("");

  if (!token) {
    return (
      <div>
        <Header />
        <AuthContainer setToken={setToken} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
