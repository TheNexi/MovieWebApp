import "../../styles/page.css";
import "../../styles/auth.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import * as authApi from "../../services/auth/authApi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authApi.login({ username, password });
      login(res.data);
      navigate("/home");
    } catch (err: any) {
      let msg = err?.response?.data?.message || "Błąd logowania";
      if (msg.toLowerCase().includes("forbidden") || msg.toLowerCase().includes("unauthorized")) {
        msg = "Nieprawidłowa nazwa użytkownika lub hasło.";
      } else if (msg.toLowerCase().includes("network")) {
        msg = "Brak połączenia z serwerem.";
      }
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Logowanie</h2>
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
          <button type="submit">Zaloguj</button>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="switch-link">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;