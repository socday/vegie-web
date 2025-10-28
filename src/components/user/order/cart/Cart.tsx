import CartItem from "./CartItem";
import "../cart/styles/Cart.css";
import React, { useEffect, useState } from "react";
import { cartCheckout, getCart, removeCartItem, updateCartItem } from "../../../../router/cartApi";
import { CartResponse, Item } from "../../../../router/types/cartResponse";
import CartCheckout from "./CartCheckout";
import WaveText from "../../../lazy/WaveText";

export default function Cart() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);  
 const userId = localStorage.getItem("userId");

  async function fetchCart() {
  try {
    const cart: CartResponse = await getCart();
    console.log("Fetched cart:", cart);
    setItems(cart.items); // set real API items
  } catch (err) {
    console.error("Failed to load cart:", err);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchCart();
  }, []);

  
  const handleRemove = async (cartId: string) => {
    if (!userId) return console.warn("No userId");
    try {
      console.log("Removing item with cartId:", cartId);
      await removeCartItem(userId, cartId);
      setItems(prev => prev.filter(item => item.cartId !== cartId)); // update UI instantly
      // optionally re-fetch if server recalculates totals
      // await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  }; 

  const handleQuantityChange = async (cartId: string, newQty: number) => {
  if (!userId) return console.warn("No userId");

  try {
    console.log("Updating cartId:", cartId, "to quantity:", newQty);
    await updateCartItem(userId, cartId, newQty); // use cartId, not id

    setItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQty } : item
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
              cartId={item.cartId}
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
