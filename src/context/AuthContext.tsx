import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { startSilentRefresh, stopSilentRefresh } from "../router/api";
import { getCustomer } from "../router/authApi";

type AuthContextType = {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  refreshAuth: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    console.log("Có token");

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
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    stopSilentRefresh(); // Clean up timer
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    setUser(null);
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  useEffect(() => {
    refreshAuth();
    startSilentRefresh();
  }, [refreshAuth]);

  // React to login/logout in other tabs
  useEffect(() => {
    const handler = () => refreshAuth();
    window.addEventListener("storage", handler);
    window.addEventListener("auth-change", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("auth-change", handler);
    };
  }, [refreshAuth]);

  // Watch for token changes (e.g., after login)
  useEffect(() => {
    const tokenListener = () => {
      refreshAuth();
    };
    window.addEventListener("token-update", tokenListener);
    return () => window.removeEventListener("token-update", tokenListener);
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
