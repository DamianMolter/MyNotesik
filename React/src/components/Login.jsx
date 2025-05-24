import React, {useState} from "react";
import axios from "axios"
import PropTypes from "prop-types";

async function loginUser(credentials) {
 return fetch('http://localhost:4000/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}


function Login({openRegisterPage, setToken}) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });
    console.log(token);
    setToken(token);
  }

  return (
    <div className="loginContainer">
      <div className="loginPanel">
        <h1>Logowanie</h1>
        <form className="loginForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)}/>
          <input type="password" placeholder="Hasło" onChange={event => setPassword(event.target.value)}/>
          <button type="submit">Zaloguj się</button>
          <p className="login-register-text">
            Nie masz konta?{" "}
            <a href="#" className="register-link" onClick={() => {openRegisterPage(false)}}>
              Zarejestruj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;
