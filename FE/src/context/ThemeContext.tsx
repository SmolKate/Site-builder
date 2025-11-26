import { THEME_ENUM } from "@/utils/constants";
import type { ThemeValue } from "@/utils/types/theme";

import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";

interface ThemeContextType {
  theme: ThemeValue;
  toggleTheme: () => void;
  setTheme: (theme: ThemeValue) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeValue>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as ThemeValue | null;
      if (stored && Object.values(THEME_ENUM).includes(stored)) {
        return stored;
      }
      return THEME_ENUM.SYSTEM;
    }
    return THEME_ENUM.LIGHT;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(THEME_ENUM.LIGHT, THEME_ENUM.DARK);

    let effectiveTheme = theme;

    if (theme === THEME_ENUM.SYSTEM) {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveTheme = systemDark ? THEME_ENUM.DARK : THEME_ENUM.LIGHT;
    }

    root.setAttribute("data-theme", effectiveTheme);

    localStorage.setItem("theme", theme);

    if (theme === THEME_ENUM.SYSTEM) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newSystemTheme = mediaQuery.matches ? THEME_ENUM.DARK : THEME_ENUM.LIGHT;
        root.setAttribute("data-theme", newSystemTheme);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev: ThemeValue) =>
      prev === THEME_ENUM.DARK ? THEME_ENUM.LIGHT : THEME_ENUM.DARK
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
