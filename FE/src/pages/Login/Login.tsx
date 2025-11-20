import { useAppDispatch } from "@/store";
import { login } from "@/store/auth";
import { useLocation, useNavigate } from "react-router-dom";

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleClickLogin = () => {
    dispatch(login());
    navigate(from, { replace: true });
  };

  return <button onClick={handleClickLogin}>Login</button>;
};
