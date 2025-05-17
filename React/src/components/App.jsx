import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Route, Switch } from "react-router";
import AuthContainer from "./AuthContainer";

function App() {
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Header />
            <AuthContainer />
            <Footer />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
