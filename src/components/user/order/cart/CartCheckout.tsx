import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../cart/styles/CartSummary.css";
import { validateDiscountCode } from "../../../../router/cartApi";

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
  const navigate = useNavigate();
  const isEmpty = items.length === 0;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [discountCode, setDiscountCode] = useState(() => localStorage.getItem("discountCode") || "");
  const [discountMessage, setDiscountMessage] = useState<string | null>(localStorage.getItem("discountMessage"));
  const [discountValue, setDiscountValue] = useState<number>(Number(localStorage.getItem("discountValue") || 0));
  const [isPercentage, setIsPercentage] = useState<boolean>(localStorage.getItem("isPercentage") === "true");
  const [finalTotal, setFinalTotal] = useState<number>(() => {
    const savedFinal = localStorage.getItem("finalTotal");
    return savedFinal ? Number(savedFinal) : total;
  });

  const handleGoToPayment = () => {
    if (isEmpty) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi tiếp tục.");
      return;
    }

    localStorage.setItem("tempCart", JSON.stringify(items));
    navigate("/thanh-toan", { state: { passedCart: items } });
  };

  const handleCheckoutClick = () => {
  if (isEmpty) {
    alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi tiếp tục.");
    return;
  }
  const codeToSend = discountCode.trim() ? discountCode.trim() : "";
  onCheckout?.(codeToSend);
};

  const handleApplyDiscount = async () => {
  if (!discountCode.trim()) {
    alert("Vui lòng nhập mã giảm giá.");
    return;
  }

  try {
    const res = await validateDiscountCode(discountCode.trim());

    setDiscountMessage(res.message);

    if (res.isSuccess && res.data.isActive) {
      const discount = res.data;

      setDiscountValue(discount.discountValue);
      setIsPercentage(discount.isPercentage);


      if (discount.isPercentage) {
        const newTotal = total - (total * discount.discountValue) / 100;
        setFinalTotal(newTotal);
        localStorage.setItem("discountCode", discount.code);
        localStorage.setItem("discountMessage", res.message);
        localStorage.setItem("discountValue", discount.discountValue.toString());
        localStorage.setItem("isPercentage", discount.isPercentage.toString());
        localStorage.setItem("finalTotal", newTotal.toString());
      } else {
        const newTotal = Math.max(total - discount.discountValue, 0);
        setFinalTotal(newTotal);
      }
    } else {
      setDiscountValue(0);
      setFinalTotal(total);
      localStorage.removeItem("discountCode");
      localStorage.removeItem("discountMessage");
      localStorage.removeItem("discountValue");
      localStorage.removeItem("isPercentage");
      localStorage.removeItem("finalTotal");
    }
  } catch (error) {
    localStorage.removeItem("discountCode");
    localStorage.removeItem("discountMessage");
    localStorage.removeItem("discountValue");
    localStorage.removeItem("isPercentage");
    localStorage.removeItem("finalTotal");
    console.error(error);
    setDiscountMessage("Có lỗi xảy ra khi áp dụng mã giảm giá.");
  }
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

      {discountMessage && (
        <div className="cart-summary__discount-message">
          <span>{discountMessage}</span>
        </div>
      )}

      {discountValue > 0 && finalTotal !== total && (
        <div className="cart-summary__row cart-summary__total">
          <span>Sau giảm giá</span>
          <span>{finalTotal.toLocaleString()} đ</span>
        </div>
      )} 

      <div className="cart-summary__form">
        <div className="cart-summary__discount">
          <input
            type="text"
            placeholder="Mã giảm giá"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button onClick={handleApplyDiscount} className="d-btn d-btn-font">
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