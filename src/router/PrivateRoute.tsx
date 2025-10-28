import { JSX, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "./authApi";
import WaveText from "../components/lazy/WaveText";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await checkAuth();
        setAuthenticated(result.isAuthenticated);
        if (!result.isAuthenticated) {
          alert("Vui lòng đăng nhập để tiếp tục!");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return (
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
        backgroundColor: "#ffffff",
        fontFamily: "Inter, sans-serif",
      }}
    >
        <WaveText />
      </div>
    );
  }

  return authenticated ? (
    children
  ) : (
    <Navigate to="/dang-nhap" replace state={{ from: location }} />
  );
}