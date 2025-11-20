import { PrivateRoute } from "@/components";
import { Outlet } from "react-router-dom";

export const ProtectedLayout = () => {
  return (
    <PrivateRoute>
      <Outlet />
    </PrivateRoute>
  );
};
