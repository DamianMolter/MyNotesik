import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function AuthContainer({ setToken, setLoggedUserId, setLoggedUserEmail }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authContainer">
      {showLogin ? (
        <Login
          openRegisterPage={setShowLogin}
          setToken={setToken}
          setLoggedUserId={setLoggedUserId}
          setLoggedUserEmail={setLoggedUserEmail}
        />
      ) : (
        <Register openLoginPage={setShowLogin} />
      )}
    </div>
  );
}

export default AuthContainer;
