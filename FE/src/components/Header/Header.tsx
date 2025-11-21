import { useAuth } from "@context";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleClickLogout = () => {
    auth.logout();
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
