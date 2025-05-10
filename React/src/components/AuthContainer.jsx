import React, { useState } from "react";

function AuthContainer() {
  const [showLogin, setShowLogin] = useState(true);

  function handleClickLogin() {
    setShowLogin(true);
  }

  function handleClickRegister() {
    setShowLogin(false);
  }

  return (
    <div className="authContainer">
      {showLogin ? (
        <div className="loginContainer">
          <div class="loginPanel">
            <h1>Logowanie</h1>
            <form class="loginForm">
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Hasło" />
              <button type="submit">Zaloguj się</button>
              <p class="login-register-text">
                Nie masz konta?{" "}
                <a href="#" class="register-link" onClick={handleClickRegister}>
                  Zarejestruj się
                </a>
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div className="registerContainer">
          <div class="registerPanel">
            <h1>Rejestracja</h1>
            <form class="registerForm">
              <input type="text" placeholder="Nazwa użytkownika" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Hasło" />
              <input type="password" placeholder="Potwierdź hasło" />
              <button type="submit">Zarejestruj się</button>
              <p class="login-register-text">
                Masz już konto?{" "}
                <a href="#" class="login-link" onClick={handleClickLogin}>
                  Zaloguj się
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthContainer;
