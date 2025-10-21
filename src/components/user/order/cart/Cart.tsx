import CartItem from "./CartItem";
import "../cart/styles/Cart.css";
import React, { useEffect, useState } from "react";
import { cartCheckout, getCart, updateCartItem } from "../../../../router/cartApi";
import { CartResponse, Item } from "../../../../router/types/cartResponse";
import CartCheckout from "./CartCheckout";
import WaveText from "../../../lazy/WaveText";

export default function Cart() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
 const userId = localStorage.getItem("userId");
  useEffect(() => {
    async function fetchCart() {
      try {
        const cart: CartResponse = await getCart();
        setItems(cart.items); // set real API items
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

 
  const handleQuantityChange = async (id: string, newQty: number) => {  if (!userId) return ("Ko lay duoc userid");
  try {
    newQty = 1;
    console.log("Updating item:", id, "to quantity:", newQty, "name", items.find(i => i.id === id)?.name);
    await updateCartItem(userId, id, newQty);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, initialQuantity: newQty } : item
      )
    );
  } catch (err) {
    console.error("Failed to update quantity:", err);
  }
  };

  // if (loading) {
    // return <p>Đang tải giỏ hàng...</p>;
  // }

  return (
    <div className="cart">
      <div className="cart-item-page">
        <h2 className="head2">Giỏ hàng</h2>
          {loading ? (
            <WaveText text="Đang tải giỏ hàng..." />
          ) : items.length === 0 ? (
            <p>
              Giỏ hàng bạn chưa có gì cả. <br />
              Ngại ngần gì chưa mua?
            </p>
          ) : (
          items.map(item => (
            <CartItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              initialQuantity={item.quantity}
              onRemove={handleRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))
        )}
      </div>

      <div className="cart-checkout-page">
        <CartCheckout
  items={items}
  mode="checkout"
/>

      </div>
    </div>
  );
}
