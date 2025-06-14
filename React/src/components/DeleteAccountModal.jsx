import React, { useState } from 'react';

function DeleteAccountModal({ onClose }) {
  const [confirmText, setConfirmText] = useState('');
  const [message, setMessage] = useState('');
  const expectedConfirmText = 'USUŃ KONTO'; // Wymagany tekst do potwierdzenia

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (confirmText !== expectedConfirmText) {
      setMessage(`Proszę wpisać "${expectedConfirmText}" aby potwierdzić.`);
      return;
    }

    // Tutaj logika do wysłania żądania usunięcia konta na serwer
    console.log('Usuwam konto...');
    // Po udanym usunięciu:
    // onClose(); // Zamknij modal
    // alert('Konto zostało usunięte pomyślnie!');
    // Przekieruj użytkownika lub wyloguj go

    // Symulacja API call
    setTimeout(() => {
      setMessage('Konto zostało usunięte pomyślnie. Zostaniesz wylogowany.');
      setConfirmText('');
      // W idealnym scenariuszu tutaj nastąpiłoby wylogowanie/przekierowanie
      // onClose(); // Możesz zamknąć modal i wywołać funkcję wylogowania z komponentu nadrzędnego
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Usuń konto</h2>
        <p>
          Potwierdź usunięcie konta, wpisując poniżej: <b>{expectedConfirmText}</b>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Wpisz "${expectedConfirmText}"`}
              required
            />
          </div>
          {message && <p className="modal-message">{message}</p>}
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