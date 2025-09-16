import { useState } from "react";
import CartItem from "./CartItem";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Cart() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Laptop", price: 999, image: "/images/laptop.png", quantity: 10 },
    { id: 2, name: "Headphones", price: 199, image: "/images/headphones.png", quantity: 2 },
  ]);

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id: number, newQty: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  return (
    <div className="cart max-w-md mx-auto mt-8 p-4 border rounded shadow">
      <h2 className="head2">Giỏ hàng</h2>

      {items.length === 0 ? (
        <p>Giỏ hàng bạn chưa có gì cả. <br></br> Ngại ngần gì chưa mua?</p>
        
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

      <div className="mt-4 font-semibold">
        Total: $
        {items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </div>
    </div>
  );
}