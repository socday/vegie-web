import { useEffect, useState } from "react";
import "../cart/styles/Cart.css";
import OrderConfirmation from "./OrderConfirm";
import CartCheckout from "../cart/CartCheckout";
import { getCart } from "../../../../router/cartApi";
import { CartResponse, Item } from "../../../../router/types/cartResponse";

export default function Payment() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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
          />
      </div>
    </div>
  );
}
