import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

import App from "../App";
import PrivateRoute from "./PrivateRoute";

const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Home = lazy(() => import("../pages/Home/Home"));
const MovieDetails = lazy(() => import("../pages/Movie/MovieDetails"));
const MoviePage = lazy(() => import("../pages/Movie/MoviePage"));
const Favourites = lazy(() => import("../pages/User/Favourites"));
const Profile = lazy(() => import("../pages/User/Profile"));

const AdvancedSearchHome = lazy(
  () => import("../pages/AdvancedSearch/AdvancedSearchHome")
);

const AdvancedSearchResults = lazy(
  () => import("../pages/AdvancedSearch/AdvancedSearchResults")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />
      },

      {
        path: "login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        )
      },

      {
        path: "register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        )
      },

      {
        path: "home",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          </PrivateRoute>
        )
      },

      {
        path: "movie/:id",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <MovieDetails />
            </Suspense>
          </PrivateRoute>
        )
      },

      {
        path: "movie-page/:id",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <MoviePage />
            </Suspense>
          </PrivateRoute>
        )
      },
      {
        path: "favourites",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Favourites />
            </Suspense>
          </PrivateRoute>
        )
      },

      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          </PrivateRoute>
        )
      },

      {
        path: "advanced-search",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading Search...</div>}>
              <AdvancedSearchHome />
            </Suspense>
          </PrivateRoute>
        )
      },

      {
        path: "advanced-search/results",
        element: (
          <PrivateRoute>
            <Suspense fallback={<div>Loading Results...</div>}>
              <AdvancedSearchResults />
            </Suspense>
          </PrivateRoute>
        )
      }
    ]
  }
]);