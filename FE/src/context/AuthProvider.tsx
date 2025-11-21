import { createContext, useContext, useState } from "react";

interface IAuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("isAuth")
  );

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuth");
  };

  const value: IAuthContextType = {
    isAuthenticated,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
