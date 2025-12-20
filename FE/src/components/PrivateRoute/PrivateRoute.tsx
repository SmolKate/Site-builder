import { useGetAuthStatusQuery } from "@/store/auth";
import { Navigate, useLocation } from "react-router-dom";

interface IPrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const { data, isLoading } = useGetAuthStatusQuery();
  const location = useLocation();

  if (isLoading) return "loading";
  if (!data?.isAuth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
