import { useAuth } from "@context";
import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleClickLogin = () => {
    auth.login();
    navigate(from, { replace: true });
  };

  return <button onClick={handleClickLogin}>Login</button>;
};
