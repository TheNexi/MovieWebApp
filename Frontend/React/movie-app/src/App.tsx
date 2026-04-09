import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles/app.css";

function App() {
  return (
    <main className="app-shell">
      <Navbar />

      <section className="page-content">
        <Outlet />
      </section>
    </main>
  );
}

export default App;