import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/RetailPackage.css";
import { PhieuSucKhoeResponse } from "../../../router/types/cartResponse";

export default function RetailPackage()  {
  const navigate = useNavigate();

  // Form state
  const [allergy, setAllergy] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");

  // Static item info
  const blindBoxId = "ca108cad-a026-4dea-b3d1-62f7fcc51ef9";
  const quantity = 1;
  const price = 150000;
    const handleThanhToan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/thanh-toan", {
      state: {
        from: "retail-package",
        allergy,
        feeling,
        blindBoxId,
        quantity,
        price,
      },
    });
  };
   return (
    <div className="form-section">
      <div className="form-left">
        <h2>Gói mua lẻ</h2>
        <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
        <ul>
          <li>
            Cung cấp từ 5 - 6 loại rau củ quả. Phù hợp với khẩu phần ăn ít người từ 3 người trở lại
          </li>
          <li>Đảm bảo đầy đủ dinh dưỡng</li>
          <li>Rau hàng tận vườn, từ nhà vườn</li>
        </ul>
      </div>

      <div className="form-divider"></div>

      <form className="form-right" onSubmit={handleThanhToan}>
        <h3>Phiếu sức khỏe</h3>
        <input
          type="text"
          name="allergy"
          placeholder="Dị ứng*"
          value={allergy}
          onChange={(e) => setAllergy(e.target.value)}
          required
        />
        <input
          type="text"
          name="feeling"
          placeholder="Hôm nay bạn cảm thấy như thế nào?"
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />

        <button type="submit" className="pay-btn">
          <span>Thanh toán</span>
        </button>
      </form>
    </div>
  );
}