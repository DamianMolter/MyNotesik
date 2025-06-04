import { useState } from "react";

export default function useLoggedUserId() {
  const getLoggedUserId = () => {
    const userId = localStorage.getItem("loggedUserId");
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
