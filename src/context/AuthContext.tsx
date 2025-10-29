import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { startSilentRefresh } from "../router/api"; // the axios setup with refresh
import { getCustomer } from "../router/authApi";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  refreshAuth: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuth = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      const res = await getCustomer();
      if (res?.isSuccess) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Auth refresh failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  useEffect(() => {
    refreshAuth();
    startSilentRefresh();
  }, [refreshAuth]);

  // cross-tab login/logout sync
  useEffect(() => {
    const handler = () => refreshAuth();
    window.addEventListener("storage", handler);
    window.addEventListener("auth-change", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("auth-change", handler);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
