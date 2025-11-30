import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useGetAuthStatusQuery, useLogoutUserMutation } from "@/store/auth";
import "./styles.scss";

export const Header = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const { data: isAuthenticated } = useGetAuthStatusQuery();
  const { theme, toggleTheme } = useTheme();

  const handleClickLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleClickLogin = () => {
    navigate("/login");
  };

  const handleClickSignup = () => {
    navigate("/signup");
  };

  const getPillNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `auth-header__link auth-header__link--pill ${isActive ? "auth-header__link--pill-active" : ""}`;

  return (
    <header className="auth-header">
      <nav className="auth-header__nav">
        <NavLink to="/" className={getPillNavLinkClass}>
          Main
        </NavLink>
        <NavLink to="/me" className={getPillNavLinkClass}>
          Profile
        </NavLink>
        <NavLink to="/login" className={getPillNavLinkClass}>
          Login page
        </NavLink>
      </nav>

      <div className="auth-header__controls">
        <button className="auth-header__theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>

        {!isAuthenticated && (
          <>
            <button
              className="auth-header__button auth-header__button--ghost"
              onClick={handleClickLogin}
            >
              Login
            </button>
            <button
              className="auth-header__button auth-header__button--primary"
              onClick={handleClickSignup}
            >
              Register
            </button>
          </>
        )}

        {isAuthenticated && (
          <button
            className="auth-header__button auth-header__button--ghost"
            onClick={handleClickLogout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
