import { useState } from "react";

export default function useLoggedUserId() {
  const getLoggedUserId = () => {
    const loggedUserIdString = localStorage.getItem("loggedUserId");
    console.log(loggedUserIdString);
    const userId = JSON.parse(loggedUserIdString);
    console.log(userId);
    return userId;
  };
  const [loggedUserId, setLoggedUserId] = useState(getLoggedUserId());

  const saveLoggedUserId = (userId) => {
    localStorage.setItem("loggedUserId", JSON.stringify(userId));
    setLoggedUserId(userId);
  };

  return {
    setLoggedUserId: saveLoggedUserId,
    loggedUserId,
  };
}
