import React, { useState } from "react";

function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmNewPassword) {
      setMessage("Nowe hasła nie są identyczne!");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Nowe hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    // Tutaj logika do wysłania danych na serwer (np. za pomocą fetch lub axios)
    console.log("Zmieniam hasło:", { currentPassword, newPassword });
    // Po udanej zmianie:
    // onClose(); // Zamknij modal
    // alert('Hasło zostało zmienione pomyślnie!');

    // Symulacja API call
    setTimeout(() => {
      setMessage("Hasło zostało zmienione pomyślnie!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // Możesz zamknąć modal po krótkim czasie, lub wymagać kliknięcia "OK"
      // onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Zmień hasło</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Aktualne hasło:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nowe hasło:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Potwierdź nowe hasło:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="modal-message">{message}</p>}
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
