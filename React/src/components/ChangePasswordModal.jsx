import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

async function changePassword(newPassword, loggedUserId) {
  const token = JSON.parse(localStorage.getItem("token"));
  return fetch(`http://localhost:4000/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      newPassword: newPassword,
      loggedUserId: loggedUserId,
    }),
  }).then((data) => data.json());
}

function ChangePasswordModal({ onClose, loggedUserId }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [changeSuccessfull, setChangeSuccessfull] = useState("");
  const {user} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmNewPassword) {
      setMessage("Nowe hasła nie są identyczne!");
      return;
    }
    if (newPassword.length < 3) {
      setMessage("Nowe hasło musi mieć co najmniej 3 znaki.");
      return;
    }
    const response = await changePassword(newPassword, user.id);
    console.log(response);
    setChangeSuccessfull(response.message);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Zmień hasło</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">Nowe hasło:</label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Potwierdź nowe hasło:</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="modal-message">{message}</p>}
          {changeSuccessfull && (
            <p className="modal-success">{changeSuccessfull}</p>
          )}
          <div className="modal-actions">
            <button type="submit" className="button primary">
              Zmień hasło
            </button>
            <button
              type="button"
              onClick={onClose}
              className="button secondary"
            >
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
