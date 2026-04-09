import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="app-nav">
      <Link to="/home">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/movie/1">Movie Details</Link>
      <Link to="/favourites">Favourites</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
};

export default Navbar;