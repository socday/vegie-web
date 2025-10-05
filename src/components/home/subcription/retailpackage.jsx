import React from "react";
import "../../../css/RetailPackage.css";

export default function RetailPackage() {
  return (
    <div className="form-section">
      <div className="form-left">
        <h2>Gói mua lẻ</h2>
        <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
        <ul>
          <li>
            Cung cấp từ 5 - 6 loại rau củ quả. Phù hợp với khẩu phần ăn ít người
            từ 3 người trở lại
          </li>
          <li>Đảm bảo đầy đủ dinh dưỡng</li>
          <li>Rau hàng tận vườn, từ nhà vườn</li>
        </ul>
      </div>

      <div className="form-divider"></div>

      <form className="form-right" action="#" method="post">
        <h3>Phiếu sức khỏe</h3>
        <input type="text" name="allergy" placeholder="Dị ứng*" required />
        <input
          type="text"
          name="feeling"
          placeholder="Hôm nay bạn cảm thấy như thế nào?"
        />
        <button type="submit" className="btn-submit">
          Thanh toán
        </button>
      </form>
    </div>
  );
}
