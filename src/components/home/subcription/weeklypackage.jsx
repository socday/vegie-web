import React from "react";
import "../../../css/WeeklyPackage.css";

export default function WeeklyPackage() {
  return (
    <section className="main-section container">
      <article className="weekly-package">
        <h2>Gói theo tuần</h2>
        <p className="subheading">TUẦN AN NHÀN (Mua lẻ theo tuần)</p>
        <ul>
          <li>Giá ưu đãi hơn</li>
          <li>
            Bao gồm 2 bốc được gieo 2 lần trong tuần tươi ngon hơn (hoặc có thể
            điều chỉnh theo mong muốn)
          </li>
          <li>Cung cấp 7-8 loại rau củ quả</li>
          <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
        </ul>
        <button className="price-btn">Giá tiền</button>
      </article>

      <div className="form-divider"></div>

      <article className="health-voucher">
        <h2>Phiếu sức khỏe</h2>
        <form>
          <label>
            <input type="text" placeholder="Dị ứng" />
            <input
              type="text"
              placeholder="Hôm nay bạn cảm thấy như thế nào?"
            />
          </label>
          <button type="submit" className="pay-btn">
            Thanh toán
          </button>
        </form>
      </article>
    </section>
  );
}
