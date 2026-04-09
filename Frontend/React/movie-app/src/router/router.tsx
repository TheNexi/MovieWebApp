import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import MovieDetails from "../pages/Movie/MovieDetails";
import Favourites from "../pages/User/Favourites";
import Profile from "../pages/User/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "movie/:id", element: <MovieDetails /> },
      { path: "favourites", element: <Favourites /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);