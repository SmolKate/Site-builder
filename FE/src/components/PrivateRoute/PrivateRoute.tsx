import { Navigate, useLocation } from "react-router-dom";
import { useGetAuthStatusQuery } from "@/store/auth";
import { authMessages } from "@/locales";

interface IPrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: IPrivateRouteProps) => {
  const { data, isLoading } = useGetAuthStatusQuery();
  const location = useLocation();

  if (isLoading) return "loading";

  if (!data?.isAuth) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          privateRedirect: true,
          message: authMessages.loginRequired,
        }}
        replace
      />
    );
  }

  return children;
};
