import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authContainer">
      {showLogin ? (
        <Login
          openRegisterPage={setShowLogin}
        />
      ) : (
        <Register openLoginPage={setShowLogin} />
      )}
    </div>
  );
}

export default AuthContainer;
