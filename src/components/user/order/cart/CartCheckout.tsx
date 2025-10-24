import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cart/styles/CartSummary.css";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartSummaryProps = {
  items: CartItem[];
  mode: "checkout" | "payment";
  onCheckout?: (discountCode: string) => void;
};

export default function CartCheckout({ items, mode, onCheckout }: CartSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const navigate = useNavigate();
  const isEmpty = items.length === 0;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleGoToPayment = () => {
    if (isEmpty) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi tiếp tục.");
      return;
    }

    // ✅ Store items in both navigation state and localStorage (for refresh safety)
    localStorage.setItem("tempCart", JSON.stringify(items));
    navigate("/thanh-toan", { state: { passedCart: items } });
  };

  const handleCheckoutClick = () => {
    if (isEmpty) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi tiếp tục.");
      return;
    }
    onCheckout?.(discountCode);
  };

  return (
    <div className="cart-summary">
      {items.map((item) => (
        <div key={item.id} className="cart-summary__row">
          <span className="cart-summary-name">{item.name}</span>
          <span>{(item.price * item.quantity).toLocaleString()} đ</span>
        </div>
      ))}

      {mode === "payment" && <div className="cart-shipping cart-summary__row"></div>}

      <div className="cart-summary__row cart-summary__total">
        <span>Tổng</span>
        <span>{total.toLocaleString()} đ</span>
      </div>

      <div className="cart-summary__form">
        <div className="cart-summary__discount">
          <input
            type="text"
            placeholder="Mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button className="d-btn d-btn-font">
            <span>Áp dụng</span>
          </button>
        </div>

        {mode === "checkout" ? (
          <>
            <button onClick={handleGoToPayment} className="d-btn d-btn-font">
              <span>Tiếp tục</span>
            </button>
            <div className="cart-summary__or">
              <span>hoặc</span>
            </div>
            <a href="/vegie-care" className="d-btn d-btn-font">
              <span>Quay lại</span>
            </a>
          </>
        ) : (
          <>
            <button
              onClick={handleCheckoutClick}
              disabled={isEmpty}
              className="d-btn d-btn-font"
            >
              <span>Tiếp tục</span>
            </button>
            <div className="cart-summary__or">
              <span>hoặc</span>
            </div>
            <a href="/gio-hang" className="d-btn d-btn-font">
              <span>Xem lại giỏ hàng</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}