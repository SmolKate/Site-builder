import { Navigate } from "react-router-dom";
import { useGetAuthStatusQuery } from "@/store/auth";
import { authMessages } from "@/locales";

interface IUnauthorizedRouteProps {
  children: React.ReactNode;
}

export const UnauthorizedRoute = ({ children }: IUnauthorizedRouteProps) => {
  const { data } = useGetAuthStatusQuery();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (data?.isAuth && isAuthPage) {
    return (
      <Navigate
        to="/"
        state={{
          unauthorizedRedirect: true,
          message: authMessages.alreadyLoggedIn,
        }}
        replace
      />
    );
  }

  return children;
};
