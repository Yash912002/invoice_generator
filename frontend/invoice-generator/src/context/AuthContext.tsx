import { useState, useEffect } from "react";
import { AuthContext } from "../hooks/useAuth";

export interface IUser {
  name?: string;
  email: string;
  password: string;
  businessName?: string;
  address?: string;
  phone?: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(checkAuthStatus, [])

  function checkAuthStatus() {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  }

  const login = (userData: IUser, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/"
  }

  const updateUser = (updateUserData: IUser) => {
    const newUserData = { ...user, ...updateUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    checkAuthStatus,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}