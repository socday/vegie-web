import React from "react";
import "../../../../css/BoxSelector.css";
import { useNavigate } from "react-router-dom"; // 👈 import thêm

export default function BoxSelector() {
      const navigate = useNavigate(); // 👈 khai báo hook để dùng navigate

  return (
    <>
      <button className="blindbox-btn">
        <span
          className="large-text"
          style={{ color: "#27600B" }}
        >
          Blind Box
        </span>
        <span className="middle-text" style={{ color: "#27600B" }}>
          Món Tròn Ngẫu Nhiên
        </span>
        <span
            className="small-text"
          style={{
            color: "#27600B",
          }}
        >
          Giao hàng tận nơi
        </span>
        <span 
            className="small-text"
          style={{
            color: "#27600B",
          }}
        >
          Được cung cấp thực đơn AI kèm Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ quả
        </span>
      </button>
      <br />
      <br />
      <br />
      <button className="fancy-btn" onClick={() => navigate("/custom-box")}>
        <span
          className="large-text"
          style={{ color: "white" }}
        >
          Custom
        </span>
        <span className="middle-text" style={{  color: "white" }}>
          Gift Box - Detox Box
        </span>
        <span
        className="small-text"
          style={{ color: "white" }}
        >
          Tự tay chọn loại rau củ theo sở thích cho box detox của bạn.
        </span>
        <span
        className="small-text"
          style={{ color: "white"}}
        >
          Hay tự trang trí Gift Box để gửi đến người thân nhé!
        </span>
      </button>
      <br />
      <br />
      <br />
       <br />
      <br />
      <br />
    </>
  );
}
