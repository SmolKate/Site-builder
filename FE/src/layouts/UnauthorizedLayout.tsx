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
      <button
        className="toggle-theme-button"
        type="button"
        onClick={toggleTheme}
        aria-label={ariaLabel}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <Outlet />
    </UnauthorizedRoute>
  );
};
