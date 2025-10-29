import React, { useState } from "react";
import "../../../css/WeeklyPackage.css";
import { useNavigate } from "react-router-dom";

export default function WeeklyPackage() {
    const navigate = useNavigate();
  
    // Form state
    const [allergy, setAllergy] = useState<string>("");
    const [feeling, setFeeling] = useState<string>("");
  
    // Static item info
    const blindBoxId = "ca108cad-a026-4dea-b3d1-62f7fcc51ef9";
    const quantity = 2;
    const price = 300000;

    const handleThanhToan = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      navigate("/thanh-toan", {
        state: {
          from: "weekly-package",
          allergy,
          feeling,
          blindBoxId,
          quantity,
          price,
        },
      });
    }
  return (
    <section className="main-section container">
      <article className="weekly-package">
        <h2>Gói theo tuần</h2>
        <p className="subheading">TUẦN AN NHÀN (Mua lẻ theo tuần)</p>
        <ul>
          <li>Giá ưu đãi hơn</li>
          <li>
            Bao gồm 2 box được gieo 2 lần trong tuần tươi ngon hơn (hoặc có thể
            điều chỉnh theo mong muốn)
          </li>
          <li>Cung cấp 7-8 loại rau củ quả</li>
          <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
        </ul>
        <button className="fancy-btn">Giá tiền</button>
      </article>

      <div className="form-divider"></div>

      <article className="health-voucher">
        <h2>Phiếu sức khỏe</h2>
        <form onSubmit={handleThanhToan}>
          <label>
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
          </label>
          <button type="submit" className="d-btn d-btn-font pay-btn">
            <span>Thanh toán
              </span>
          </button>
        </form>
      </article>
    </section>
  );
}
