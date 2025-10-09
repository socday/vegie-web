import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GiftPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "(Không có lời nhắn)";

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Gift Box Preview</h1>
      <p><strong>Lời nhắn của bạn:</strong></p>
      <div
        style={{
          border: "2px solid #91CF43",
          borderRadius: "16px",
          padding: "20px",
          width: "400px",
          margin: "20px auto",
          textAlign: "left",
        }}
      >
        {message}
      </div>

      <button
        style={{
          backgroundColor: "#91CF43",
          border: "none",
          borderRadius: "20px",
          padding: "10px 20px",
          fontSize: "1rem",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </button>
    </div>
  );
}