import React from "react";
import "./styles/WeeklyPackage.css";

export default function MyWeeklyPackage()   {
  return (
    <div className="main-page">
      <div className="weekly-package-card">
        {/* Left Section */}
        <div className="package-left">
          <h2>Gói theo tuần</h2>
          <h4>Tuần ăn nhân (Meal kế theo tuần)</h4>
          <ul>
            <li>Giá ưu đãi hơn</li>
            <li>
              Bao gồm 2 box được giao 3 lần trong tuần tươi ngon hơn (hoặc có
              thể điều chỉnh theo mong muốn)
            </li>
            <li>Cung cấp 7–8 loại món mỗi tuần</li>
            <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
          </ul>
          <button className="fancy-btn">Gói tiềm</button>
        </div>

        {/* Right Section */}
        <div className="package-right">
          <h3>Phiếu sức khỏe</h3>
          <input type="text" placeholder="Dị ứng*" />
          <input
            type="text"
            placeholder="Hôm nay bạn cảm thấy như thế nào?"
          />
          <button className="d-btn d-btn-font">Thanh toán</button>
        </div>
      </div>
    </div>
  );
};

