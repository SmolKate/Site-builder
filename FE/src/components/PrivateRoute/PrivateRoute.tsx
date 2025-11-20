import type { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface IPrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
