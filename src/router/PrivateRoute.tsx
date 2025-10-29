import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import WaveText from "../components/lazy/WaveText";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Still checking (avoid redirecting too early)
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

  // If not authenticated, navigate (no alert)
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  // Otherwise render page
  return children;
}
