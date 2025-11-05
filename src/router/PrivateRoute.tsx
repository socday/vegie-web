import React, { JSX, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import WaveText from "../components/lazy/WaveText";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const [countdown, setCountdown] = useState(20); // 20 seconds

  // Countdown only runs while loading
  useEffect(() => {
    if (!loading) return; // only count down when still loading

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  // If countdown finished and still not authenticated, redirect
  if (loading && countdown <= 0) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  // While still checking (show WaveText + countdown)
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          backgroundColor: "#ffffff",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <WaveText />
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", color: "#333" }}>
          Checking authentication... ({countdown}s)
        </p>
      </div>
    );
  }

  // If not authenticated after check
  if (!isAuthenticated) {
    return <Navigate to="/dang-nhap" replace state={{ from: location }} />;
  }

  // Otherwise render the protected page
  return children;
}
