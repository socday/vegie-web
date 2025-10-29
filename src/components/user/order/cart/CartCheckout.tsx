import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  onPayment?: () => void;
};

export default function CartCheckout({ items, mode, onCheckout, onPayment }: CartSummaryProps) {
  const navigate = useNavigate();
  const isEmpty = items.length === 0;
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation();
  const retailPrice = 150000;
  const weeklyPrice = 300000;
  const retailState = location.state as
    | {
        from?: string;
        allergy?: string;
        feeling?: string;
        blindBoxId?: string;
        quantity?: number;
        price?: number;
      }
    | undefined;

  const isFromRetail = retailState?.from === "retail-package";
  const isFromWeekly = retailState?.from === "weekly-package";
  
  const total = isFromRetail
  ? retailPrice 
  : isFromWeekly
  ? weeklyPrice
  : items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ State setup
  const [discountCode, setDiscountCode] = useState(localStorage.getItem("discountCode") || "");
  const [discountMessage, setDiscountMessage] = useState<string | null>(
    localStorage.getItem("discountMessage")
  );
  const [discountValue, setDiscountValue] = useState<number>(
    Number(localStorage.getItem("discountValue") || 0)
  );
  const [isPercentage, setIsPercentage] = useState<boolean>(
    localStorage.getItem("isPercentage") === "true"
  );
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
    console.log("Checkout clicked", isLoading);
    if (isEmpty) {
      alert("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi tiếp tục.");
      return;
    }
    setIsLoading(true);
    const codeToSend = discountCode.trim() || "";
    onCheckout?.(codeToSend);
  };

  const handlePayment = () => {
    if (isFromWeekly) {
      // retailState.deliveryStartDate = "asd";
    }
    setIsLoading(true);
    onPayment?.();
  };

  const clearDiscountStorage = () => {
    [
      "discountCode",
      "discountMessage",
      "discountValue",
      "isPercentage",
      "finalTotal",
    ].forEach((key) => localStorage.removeItem(key));
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

        const newTotal = discount.isPercentage
          ? total - (total * discount.discountValue) / 100
          : Math.max(total - discount.discountValue, 0);

        setFinalTotal(newTotal);

        localStorage.setItem("discountCode", discount.code);
        localStorage.setItem("discountMessage", res.message);
        localStorage.setItem("discountValue", discount.discountValue.toString());
        localStorage.setItem("isPercentage", discount.isPercentage.toString());
        localStorage.setItem("finalTotal", newTotal.toString());
      } else {
        clearDiscountStorage();
        setDiscountValue(0);
        setFinalTotal(total);
      }
    } catch (error) {
      console.error("Discount error:", error);
      clearDiscountStorage();
      setDiscountMessage("Có lỗi xảy ra khi áp dụng mã giảm giá.");
    }
  };

  useEffect(() => {
    console.log("MANG QUA: ", retailState)
    const handleBeforeUnload = () => clearDiscountStorage();

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (!window.location.pathname.includes("thanh-toan")) clearDiscountStorage();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="cart-summary">
{isFromRetail ? (
  <div className="cart-summary__row">
    <span className="cart-summary-name">Gói mua lẻ (1 hộp)</span>
    <span>{(retailPrice).toLocaleString()} đ</span>
  </div>
) : isFromWeekly ? (
  <div className="cart-summary__row">
    <span className="cart-summary-name">Gói theo tuần (2 hộp)</span>
    <span>{(weeklyPrice).toLocaleString()} đ</span>
  </div>
) : (
  items.map((item) => (
    <div key={item.id} className="cart-summary__row">
      <span className="cart-summary-name">{item.name}</span>
      <span>{(item.price * item.quantity).toLocaleString()} đ</span>
    </div>
  ))
)}

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
              onClick={isFromRetail || isFromWeekly? handlePayment : handleCheckoutClick}
              disabled={isEmpty || isLoading}
              className="d-btn d-btn-font"
            >
              {isLoading ?<span >Xử lý...</span> : <span>Thanh toán</span>}
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