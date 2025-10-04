import { useEffect, useState } from "react";
import "../cart/styles/Cart.css";
import OrderConfirmation from "./OrderConfirm";
import CartCheckout from "../cart/CartCheckout";
import { cartCheckout, getCart } from "../../../../router/cartApi";
import { CartResponse, Item } from "../../../../router/types/cartResponse";

export default function Payment() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCheckout = async (discountCode: string) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("No userId found for checkout.");
    return;
  }
  try {
    const checkoutData = {
      paymentMethod: 0, 
      deliveryMethod: 0,
      discountCode: discountCode,
    };
    const response = await cartCheckout(userId, checkoutData);
    console.log("Checkout success:", response.data);
    window.location.href = "/"; 
  } catch (error) {
    console.error("Checkout failed:", error);
  }
  finally {
    return false;
  }
};
  useEffect(() => {
    async function fetchCart() {
      try {
        const cart: CartResponse = await getCart();
        setItems(cart.items);
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  return (
    <div className="cart">
      <div className="cart-item-page">
        <OrderConfirmation />
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
