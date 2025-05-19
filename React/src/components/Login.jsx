import React from "react";
import axios from 

function Login(props) {

  return (
    <div className="loginContainer">
      <div class="loginPanel">
        <h1>Logowanie</h1>
        <form class="loginForm">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Hasło" />
          <button type="submit">Zaloguj się</button>
          <p class="login-register-text">
            Nie masz konta?{" "}
            <a href="#" class="register-link" onClick={() => {props.openRegisterPage(false)}}>
              Zarejestruj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
