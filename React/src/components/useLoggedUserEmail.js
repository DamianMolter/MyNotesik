import { useState } from "react";

export default function useLoggedUserEmail() {
  const getLoggedUserEmail = () => {
    const userEmail = localStorage.getItem("loggedUserEmail");
    //const userEmail = JSON.parse(loggedUserEmailString);
    return userEmail;
  };
  const [loggedUserEmail, setLoggedUserEmail] = useState(getLoggedUserEmail());

  const saveLoggedUserEmail = (userEmail) => {
    localStorage.setItem("loggedUserEmail", JSON.stringify(userEmail));
    setLoggedUserEmail(userEmail);
  };

  return {
    setLoggedUserEmail: saveLoggedUserEmail,
    loggedUserEmail,
  };
}
