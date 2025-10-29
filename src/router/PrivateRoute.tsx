import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import WaveText from "../components/lazy/WaveText";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (user === null && !isAuthenticated) {
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

  if (!isAuthenticated) {
    alert("Vui lòng đăng nhập để tiếp tục!");
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  return children;
}
