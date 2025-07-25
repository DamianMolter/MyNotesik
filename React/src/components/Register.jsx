import {useState} from "react";
import { apiService } from "../services/api";

function Register({openLoginPage}) {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [emailOccupied, setEmailOccupied] = useState(false);
  const [passwordConfirmFailed, setPasswordConfirmFailed] = useState(false);
  const [registerSuccessfull, setRegisterSuccessfull] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if(password != confirmPassword){
      setPasswordConfirmFailed(true);
    }

    const response = await apiService.register({
      email,
      password,
      confirmPassword
    });
    const {emailOccupied, passwordConfirmFailed, registerSuccessfull} = response;
    setEmailOccupied(emailOccupied);    
    setRegisterSuccessfull(true);
     setTimeout(() => {
      openLoginPage(true);
    }, 1500);
  }

  return (
    <div className="registerContainer">
      <div className="registerPanel">
        <h1>Rejestracja</h1>
        <form className="registerForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" onChange={event => {setEmail(event.target.value)}}/>
          <input type="password" placeholder="Hasło" onChange={event => {setPassword(event.target.value)}}/>
          <input type="password" placeholder="Potwierdź hasło" onChange={event => {setConfirmPassword(event.target.value)}}/>
          <button type="submit">Zarejestruj się</button>
          {registerSuccessfull && <p style={{color: "green", fontWeight: "bold"}}>Twoje konto zostało założone pomyślnie! Zaloguj się!</p>}
          {passwordConfirmFailed && <p style={{color: "red", fontWeight: "bold"}}>Podane hasła nie są identyczne!</p>}
          {emailOccupied && <p style={{color: "red", fontWeight: "bold"}}>Na podany adres email zostało już założone konto!</p>}
          <p className="login-register-text">
            Masz już konto?{" "}
            <a href="#" className="login-link" onClick={() => {openLoginPage(true)}}>
              Zaloguj się
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
