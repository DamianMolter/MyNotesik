import Header from "./Header";
import Footer from "./Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import AuthContainer from "./AuthContainer";
import { useAuth } from "../contexts/AuthContext";

function App() {
  const {token, user}  = useAuth();

  if (!token) {
    return (
      <div>
        <Header />
        <AuthContainer/>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard />
            }
          />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
