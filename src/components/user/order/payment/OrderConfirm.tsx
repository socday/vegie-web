import React, { useState } from "react";
import "./styles/OrderConfirm.css";

type OrderConfirmationProps = {
  onPaymentChange: (method: number) => void;
};

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onPaymentChange }) => {
  const [selectedMethod, setSelectedMethod] = useState<number>(2); 

  const handlePaymentChange = (method: number) => {
    setSelectedMethod(method);
    onPaymentChange(method);
  };

  return (
    <div className="order-confirmation">
      <h3>Xác nhận đơn hàng</h3>
      <div className="order-confirmation__address">
        <span><strong>Nhà của Giang :</strong> Opal Boulevard PVĐ</span>
        <span>0123456789</span>
        <button className="edit-btn">✎</button>
      </div>

      <h4>Phương thức giao hàng</h4>
      <div className="order-confirmation__shipping">
        <label>
          <input type="radio" name="shipping" defaultChecked />
          Bình thường <span>Miễn phí</span>
        </label>
      </div>

      <h4>Phương thức thanh toán</h4>
      <div className="order-confirmation__payment">
        <label>
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === 1}
            onChange={() => handlePaymentChange(1)}
          />
          Thanh toán khi nhận hàng (COD)
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            checked={selectedMethod === 2}
            onChange={() => handlePaymentChange(2)}
          />
          PayOS
        </label>
      </div>
    </div>
  );
};

export default OrderConfirmation;