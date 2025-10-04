import { JSX, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "./authApi";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth().then((result) => {
      setAuthenticated(result.isAuthenticated);
      setLoading(false);
    });
  }, []);

  if (loading) {
    // 🚨 instead of showing "nothing", keep user on the previous page
    return null;
  }

  return authenticated
    ? children
    : <Navigate to="/dang-nhap" replace state={{ from: location }} />;
}
