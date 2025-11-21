import { useAuth } from "@context";
import { Navigate, useLocation } from "react-router-dom";

interface IPrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
