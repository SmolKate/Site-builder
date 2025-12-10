import { UnauthorizedRoute } from "@/components";
import { useTheme } from "@/context";
import { Outlet } from "react-router-dom";
import { themeToggle } from "@/locales";
import "./styles.scss";

export const UnauthorizedLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const ariaLabel = theme === "light" ? themeToggle.switchToDark : themeToggle.switchToLight;

  return (
    <UnauthorizedRoute>
      <div className="unauth-layout">
        <div className="unauth-layout__bar">
          <button
            type="button"
            className="unauth-layout__theme-btn"
            onClick={toggleTheme}
            aria-label={ariaLabel}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <Outlet />
      </div>
    </UnauthorizedRoute>
  );
};
