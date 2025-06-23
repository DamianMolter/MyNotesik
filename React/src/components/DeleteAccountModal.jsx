import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

async function deleteAllUserData(loggedUserId) {
  const token = JSON.parse(sessionStorage.getItem("token"));
 return fetch(`http://localhost:4000/user`, {
   method: 'DELETE',
   headers: {
     'Content-Type': 'application/json',
     "Authorization": `Bearer ${token}`,
   },
   body: JSON.stringify({
      loggedUserId: loggedUserId
   })
 })
   .then((data) => data.json())
}

function DeleteAccountModal({ onClose}) {
  const [confirmText, setConfirmText] = useState('');
  const [message, setMessage] = useState('');
  const [deleteSuccessfull, setDeleteSuccessfull] = useState("");
  const expectedConfirmText = 'usuń konto';
  const {user, logout} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (confirmText !== expectedConfirmText) {
      setMessage(`Proszę wpisać "${expectedConfirmText}" aby potwierdzić.`);
      return;
    }

    const result = await deleteAllUserData(user.id);
    setDeleteSuccessfull(result.message);

    setTimeout(() => {
      setConfirmText('');
      onClose();
      logout();
    }, 2000);
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