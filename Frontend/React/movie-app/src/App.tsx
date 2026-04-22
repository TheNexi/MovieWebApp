import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/app.css";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <main className="app-shell">
      {user && <Navbar />}
      <section className="page-content">
        <Outlet />
      </section>
    </main>
  );
}

export default App;