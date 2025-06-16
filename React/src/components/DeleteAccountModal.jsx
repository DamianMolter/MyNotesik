import React, { useState } from 'react';

async function deleteAllUserData(loggedUserId) {
 return fetch(`http://localhost:4000/user`, {
   method: 'DELETE',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({
      loggedUserId: loggedUserId
   })
 })
   .then((data) => data.json())
}

function DeleteAccountModal({ onClose, loggedUserId, setToken }) {
  const [confirmText, setConfirmText] = useState('');
  const [message, setMessage] = useState('');
  const [deleteSuccessfull, setDeleteSuccessfull] = useState("");
  const expectedConfirmText = 'usuń konto'; // Wymagany tekst do potwierdzenia

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (confirmText !== expectedConfirmText) {
      setMessage(`Proszę wpisać "${expectedConfirmText}" aby potwierdzić.`);
      return;
    }

    const result = await deleteAllUserData(loggedUserId);
    setDeleteSuccessfull(result.deleteSuccessfull);

    setTimeout(() => {
      setConfirmText('');
      onClose();
      setToken("");
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Usuń konto</h2>
        <p>
          Potwierdź usunięcie konta, wpisując poniżej: <b>{expectedConfirmText}</b>
        </p>
        <p>Usunięciu ulegnie Twoje konto oraz wszystkie Twoje notatki.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Wpisz "${expectedConfirmText}"`}
              required
            />
          </div>
          {message && <p className="modal-message">{message}</p>}
          {deleteSuccessfull && <p className="modal-success">{deleteSuccessfull}</p>}
          <div className="modal-actions">
            <button type="submit" className="button danger">Usuń konto</button>
            <button type="button" onClick={onClose} className="button secondary">Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteAccountModal;