import { NavLink, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/auth";
import { useTheme } from "@/context/ThemeContext";

import "./styles.scss";

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state: any) => state.auth?.isAuthenticated);
  const { theme, toggleTheme } = useTheme();

  const handleClickLogout = () => {
    dispatch(logout());
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
