import React from "react";
import "./styles/PaymentSummary.css";

const PaymentSummary: React.FC = () => {
  return (
    <div className="payment-summary">
      <div className="payment-summary__product">
        <div className="payment-summary__image"></div>
        <div>
          <div className="payment-summary__title">Gift box</div>
          <div className="payment-summary__desc">Mô tả sản phẩm</div>
        </div>
      </div>

      <div className="payment-summary__row">
        <span>Phí gitylesng</span>
        <span>Giá tiền</span>
      </div>
      <div className="payment-summary__row">
        <span>Rau siêu ngon</span>
        <span>Giá tiền</span>
      </div>

      <div className="payment-summary__row payment-summary__total">
        <span>Tổng</span>
        <span>Giá tiền</span>
      </div>

      <div className="payment-summary__discount">
        <input type="text" placeholder="Mã giảm giá" />
        <button>Áp dụng</button>
      </div>

      <button className="payment-summary__continue">Tiếp tục</button>
      <div className="payment-summary__or">hoặc</div>
      <button className="payment-summary__back">Xem lại giỏ hàng</button>
    </div>
  );
};

export default PaymentSummary;