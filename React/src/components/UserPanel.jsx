import React from "react";

function UserPanel({ loggedUserEmail, setLoggedUserId, setLoggedUserEmail, setToken }) {
  function handleClick() {
    setToken("");
    setLoggedUserId(-1);
    setLoggedUserEmail("");
  }

  return (
    <div className="user-panel-container">
      <div className="user-panel">
        <div className="user-info">
          <p>Zalogowano jako:</p>
          <p>
            <b>{loggedUserEmail}</b>
          </p>
        </div>
        <button className="logout-button" onClick={handleClick}>
          Wyloguj
        </button>
      </div>
    </div>
  );
}

export default UserPanel;
