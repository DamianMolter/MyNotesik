import React from "react";

function Register(props) {

  return (
    <div className="registerContainer">
      <div class="registerPanel">
        <h1>Rejestracja</h1>
        <form class="registerForm">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Hasło" />
          <input type="password" placeholder="Potwierdź hasło" />
          <button type="submit">Zarejestruj się</button>
          <p class="login-register-text">
            Masz już konto?{" "}
            <a href="#" class="login-link" onClick={() => {props.openLoginPage(true)}}>
              Zaloguj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
