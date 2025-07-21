import App from "./App";
import { AuthProvider } from "../contexts/AuthContext";

function MainApp() {
  useEffect(() => {
    fetch("http://127.0.0.1:4000/health")
      .then((res) => res.json())
      .then((data) => console.log("API works:", data))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default MainApp;
