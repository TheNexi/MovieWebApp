import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import { lazy, Suspense } from "react";

const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Home = lazy(() => import("../pages/Home/Home"));
const MovieDetails = lazy(() => import("../pages/Movie/MovieDetails"));
const Favourites = lazy(() => import("../pages/User/Favourites"));
const Profile = lazy(() => import("../pages/User/Profile"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      ) },
      { path: "home", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Home />
        </Suspense>
      ) },
      { path: "login", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Login />
        </Suspense>
      ) },
      { path: "register", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Register />
        </Suspense>
      ) },
      { path: "movie/:id", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MovieDetails />
        </Suspense>
      ) },
      { path: "favourites", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Favourites />
        </Suspense>
      ) },
      { path: "profile", element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      ) },
    ],
  },
]);