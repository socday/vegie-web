// src/components/auth/PrivateRoute.tsx
import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "./authApi";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth().then((result) => {
      setAuthenticated(result.isAuthenticated);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/dang-nhap" replace />;
}
