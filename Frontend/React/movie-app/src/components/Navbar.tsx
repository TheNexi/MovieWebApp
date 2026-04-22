import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="app-nav">
      <Link to="/home">Home</Link>
      <Link to="/movie/1">Movie Details</Link>
      <Link to="/favourites">Favourites</Link>
      <Link to="/profile">Profile</Link>
      <button onClick={handleLogout} style={{ marginLeft: 16 }}>Wyloguj</button>
    </nav>
  );
};

export default Navbar;