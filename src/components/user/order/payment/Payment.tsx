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
  const [paymentMethod, setPaymentMethod] = useState<number>(2); // default 2 = VNPay
  const navigate = useNavigate();
  const location = useLocation();


const handleCheckout = async (discountCode: string) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("No userId found for checkout.");
    return;
  }

  try {
    const checkoutData = {
      paymentMethod, // dynamically chosen by user
      deliveryMethod: 0,
      discountCode,
    };

    const response = await cartCheckout(userId, checkoutData);
    console.log("Checkout success:", response.data);
    console.log("PAYMENT METHOD IS : ", paymentMethod);
    if (paymentMethod === 2 && response.data.data.id) {
      try {
        console.log("DANG TAO LINK NE");
        const paymentRes = await getPaymentLink(response.data.data.id);
        console.log("PAYMENT RES: ", paymentRes);
        if (paymentRes.isSuccess && paymentRes.data.paymentUrl) {
          // redirect to PayOS payment page
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          alert("Không thể tạo liên kết thanh toán.");
        }
      } catch (err) {
        console.error("Failed to create payment link:", err);
        alert("Lỗi khi tạo liên kết thanh toán.");
      }
    } else {
      // Default case: other payment method
      // navigate("/noti/order-success");
    }

  } catch (error) {
    console.error("Checkout failed:", error);
  } finally {
    return false;
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
        <OrderConfirmation onPaymentChange={setPaymentMethod} />
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