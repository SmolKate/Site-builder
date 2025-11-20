import { useAppDispatch } from "@/store";
import { logout } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClickLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between" }}>
      <div>меню</div>
      <div>пользователь</div>
      <button onClick={handleClickLogout}>Logout</button>
    </header>
  );
};
