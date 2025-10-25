import { useEffect, useState } from "react";
import "../cart/styles/Cart.css";
import OrderConfirmation from "./OrderConfirm";
import CartCheckout from "../cart/CartCheckout";
import { cartCheckout, getCart } from "../../../../router/cartApi";
import { CartResponse, Item } from "../../../../router/types/cartResponse";
import { useNavigate, useLocation } from "react-router-dom";
import { getPaymentLink } from "../../../../router/orderApi";

export default function Payment({ passedCart }: { passedCart?: Item[] }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<number>(2);
  const [checkoutData, setCheckoutData] = useState<{
    address: string;
    deliveryTo: string;
    phoneNumber: string;
    deliveryMethod?: number;
    discountCode?: string;
  }>({
    address: "",
    deliveryTo: "",
    phoneNumber: "",
    deliveryMethod: 0,
    discountCode: undefined,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Handle updates from OrderConfirmation
  const handleCheckoutDataChange = (data: Partial<typeof checkoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...data }));
  };

  const handleCheckout = async (discountCode: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No userId found for checkout.");
      return;
    }

    try {
      const payload = {
        paymentMethod,
        deliveryMethod: checkoutData.deliveryMethod || 0,
        discountCode: discountCode || checkoutData.discountCode || "",
        address: checkoutData.address,
        deliveryTo: checkoutData.deliveryTo,
        phoneNumber: checkoutData.phoneNumber,
      };

      const response = await cartCheckout(userId, payload);

      if (paymentMethod === 2 && response.data.data.id) {
        const paymentRes = await getPaymentLink(response.data.data.id);
        if (paymentRes.isSuccess && paymentRes.data.paymentUrl) {
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          alert("Không thể tạo liên kết thanh toán.");
        }
      } else {
        navigate("/noti/order-success");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Thanh toán thất bại, vui lòng thử lại.");
    }
  };

  useEffect(() => {
    async function loadCart() {
      const passedCartState = location.state?.passedCart;

      if (passedCartState && passedCartState.length > 0) {
        setItems(passedCartState);
        setLoading(false);
        return;
      }

      const storedCart = JSON.parse(localStorage.getItem("tempCart") || "[]");
      if (storedCart.length > 0) {
        setItems(storedCart);
        setLoading(false);
        return;
      }

      try {
        const cart: CartResponse = await getCart();
        setItems(cart.items);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, [location.state]);

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  return (
    <div className="cart">
      <div className="cart-item-page">
        <OrderConfirmation
          onPaymentChange={setPaymentMethod}
          onCheckoutDataChange={handleCheckoutDataChange}
        />
      </div>

      <div className="cart-checkout-page">
        <CartCheckout
          items={items}
          mode="payment"
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}