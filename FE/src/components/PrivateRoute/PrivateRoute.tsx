import { Navigate, useLocation } from "react-router-dom";
import { useGetAuthStatusQuery } from "@/store/auth";
import { LOGIN_REQUIRED_MESSAGE } from "@/utils/constants";

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
          message: LOGIN_REQUIRED_MESSAGE,
        }}
        replace
      />
    );
  }

  return children;
};
