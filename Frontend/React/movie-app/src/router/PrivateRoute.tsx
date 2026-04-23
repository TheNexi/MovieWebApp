import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCheckAuth } from "./useCheckAuth";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, logout } = useAuth();
  const { loading, authorized } = useCheckAuth();

  if (loading) return <div>Sprawdzanie autoryzacji...</div>;
  if (!user || !authorized) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
