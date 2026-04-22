import "../../styles/page.css";
import "../../styles/auth.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as authApi from "../../services/auth/authApi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await authApi.register({ username, password });
      setSuccess("Rejestracja udana! Możesz się zalogować.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      let msg = err?.response?.data?.message || "Błąd rejestracji";
      if (msg.toLowerCase().includes("forbidden")) {
        msg = "Nie masz uprawnień do rejestracji.";
      } else if (msg.toLowerCase().includes("conflict")) {
        msg = "Użytkownik o tej nazwie już istnieje.";
      } else if (msg.toLowerCase().includes("network")) {
        msg = "Brak połączenia z serwerem.";
      }
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Zarejestruj</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
        <div className="switch-link">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;