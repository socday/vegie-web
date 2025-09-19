import React from "react";
import "./styles/OrderConfirm.css";

const OrderConfirmation: React.FC = () => {
  return (
    <div className="order-confirmation">
      <h3>Xác nhận đơn hàng</h3>
      <div className="order-confirmation__address">
        <span><strong>Nhà của Giang :</strong>Opal Boulevard PVĐ</span>
        <span>0123456789</span>
        <button className="edit-btn">✎</button>
      </div>

      <h4>Phương thức giao hàng</h4>
      <div className="order-confirmation__shipping">
        <label><input type="radio" name="shipping" /> Hỏa tốc </label>
        <label><input type="radio" name="shipping" /> Bình thường <span>Miễn phí</span></label>
      </div>

      <h4>Phương thức thanh toán</h4>
      <div className="order-confirmation__payment">
        <label><input type="radio" name="payment" /> Thanh toán khi nhận hàng (COD)</label>
        <label><input type="radio" name="payment" /> VN-PAY</label>
      </div>
    </div>
  );
};

export default OrderConfirmation;