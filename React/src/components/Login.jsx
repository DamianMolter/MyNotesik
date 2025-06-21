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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    await login({ email, password });
    setIsLoading(false);
  };

  return (
    <div className="loginContainer">
      <div className="loginPanel">
        <h1>Logowanie</h1>
        <form className="loginForm" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Hasło" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </button>
          {error && (
            <p style={{color: "red", fontWeight: "bold"}}>
              {error}
            </p>
          )}
          <p className="login-register-text">
            Nie masz konta?{" "}
            <a 
              href="#" 
              className="register-link" 
              onClick={() => openRegisterPage(false)}
            >
              Zarejestruj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
