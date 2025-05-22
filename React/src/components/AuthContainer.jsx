import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function AuthContainer(props) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authContainer">
      {showLogin ? (
        <Login openRegisterPage={setShowLogin} setToken={props.setToken} />
      ) : (
        <Register openLoginPage={setShowLogin} />
      )}
    </div>
  );
}

export default AuthContainer;
