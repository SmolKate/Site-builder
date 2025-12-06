import { UnauthorizedRoute } from "@/components";
import { Outlet } from "react-router-dom";

export const UnauthorizedLayout = () => {
  return (
    <UnauthorizedRoute>
      <Outlet />
    </UnauthorizedRoute>
  );
};
