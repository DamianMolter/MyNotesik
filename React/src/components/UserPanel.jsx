import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useAuth } from "../contexts/AuthContext";

function UserPanel() {

  const {user, logout} = useAuth();
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const toggleAccountOptions = () => {
    setShowAccountOptions(!showAccountOptions);
  };

  const openChangePasswordModal = (e) => {
    e.stopPropagation(); // Zapobiega zamknięciu opcji konta po kliknięciu
    setShowChangePasswordModal(true);
    setShowAccountOptions(false); // Zamknij opcje po otwarciu modala
  };

  const closeChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const openDeleteAccountModal = (e) => {
    e.stopPropagation(); // Zapobiega zamknięciu opcji konta po kliknięciu
    setShowDeleteAccountModal(true);
    setShowAccountOptions(false); // Zamknij opcje po otwarciu modala
  };

  const closeDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
  };

  return (
    <div className="user-panel-container">
      <div className="user-panel">
        <div className="user-info">
          <p>Zalogowano jako:</p>
          <p>
            <b onClick={toggleAccountOptions} style={{ cursor: "pointer" }}>
              {user.email}
            </b>
            <ArrowDropDownIcon fontSize="small" />
          </p>
          {showAccountOptions && (
            <div className="account-options">
              <p
                onClick={openChangePasswordModal}
                style={{ cursor: "pointer" }}
              >
                Zmień hasło
              </p>
              <p
                onClick={openDeleteAccountModal}
                style={{ cursor: "pointer", color: "red" }}
              >
                Usuń konto
              </p>
            </div>
          )}
        </div>
        <button className="logout-button" onClick={logout}>
          Wyloguj
        </button>
      </div>
      {showChangePasswordModal && (
        <ChangePasswordModal onClose={closeChangePasswordModal}/>
      )}
      {showDeleteAccountModal && (
        <DeleteAccountModal onClose={closeDeleteAccountModal}/>
      )}
    </div>
  );
}

export default UserPanel;
