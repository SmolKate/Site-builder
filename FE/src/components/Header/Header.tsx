import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useGetAuthStatusQuery, useLogoutUserMutation } from "@/store/auth";
import { getSiteTitle } from "@/store/builder";
import { useAppSelector } from "@/store";
import { themeToggle , headerMessages } from "@/locales";
import "./styles.scss";

export const Header = () => {
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const siteTitle = useAppSelector(getSiteTitle);
  const { data: authStatus } = useGetAuthStatusQuery();
  const isAuthenticated = authStatus?.isAuth ?? false;
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
          {headerMessages.main}
        </NavLink>
        <NavLink to="/me" className={getPillNavLinkClass}>
          {headerMessages.profile}
        </NavLink>
        {!isAuthenticated && (
          <NavLink to="/login" className={getPillNavLinkClass}>
            {headerMessages.login}
          </NavLink>
        )}
      </nav>

      {siteTitle}

      <div className="auth-header__controls">
        <button
          type="button"
          className="auth-header__theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === "light" ? themeToggle.switchToDark : themeToggle.switchToLight}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {isAuthenticated ? (
          <button
            type="button"
            className="auth-header__button auth-header__button--ghost"
            onClick={handleClickLogout}
          >
            {headerMessages.logout}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="auth-header__button auth-header__button--ghost"
              onClick={handleClickLogin}
            >
              {headerMessages.login}
            </button>
            <button
              type="button"
              className="auth-header__button auth-header__button--primary"
              onClick={handleClickSignup}
            >
              {headerMessages.register}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
