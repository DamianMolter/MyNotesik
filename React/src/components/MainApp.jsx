import App from "./App";
import { AuthProvider } from "../contexts/AuthContext";

function MainApp() {
  return(
   <AuthProvider>
      <App />
   </AuthProvider>
  );
}

export default MainApp;
