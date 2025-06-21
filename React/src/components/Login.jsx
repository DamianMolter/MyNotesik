import React, {useState} from "react";
import { useAuth } from "../contexts/AuthContext";

async function loginUser(credentials) {
 return fetch('http://localhost:4000/login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}


function Login({openRegisterPage}) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginError, setLoginError] = useState(false);
  const {login} = useAuth();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await login({
      email,
      password
    });
    setLoginError(response.error);
  }

  return (
    <div className="loginContainer">
      <div className="loginPanel">
        <h1>Logowanie</h1>
        <form className="loginForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={event => setEmail(event.target.value)}/>
          <input type="password" placeholder="Hasło" onChange={event => setPassword(event.target.value)}/>
          <button type="submit">Zaloguj się</button>
          {loginError && <p style={{color: "red", fontWeight: "bold"}}>Podane dane logowania są nieprawidłowe!</p>}
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

export default Login;
