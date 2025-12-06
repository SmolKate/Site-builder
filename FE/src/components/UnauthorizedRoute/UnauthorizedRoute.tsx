import { Navigate } from "react-router-dom";
import { useGetAuthStatusQuery } from "@/store/auth";
import { ALREADY_LOGGED_IN_MESSAGE } from "@/utils/constants";

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
          message: ALREADY_LOGGED_IN_MESSAGE,
        }}
        replace
      />
    );
  }

  return children;
};
