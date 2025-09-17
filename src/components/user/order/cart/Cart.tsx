import { useState } from "react";
import CartItem from "./CartItem";
import { CartCheckout } from "./CartCheckout";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Cart() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Lwioasdsajdopijw3eoipjaioprj31094je0q9dw013h4r0931qh0931h4r01-4hr30ij3jqoiejqoiejqwoijeqiowejqoiejqwoiejqwoosjdozijdoizjsoizjdsozijdoaptop", price: 999, image: "/images/laptop.png", quantity: 10 },

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
    <div className="cart">
      <div className="cart-item-page">

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
      <div className="cart-checkout-page">
          <CartCheckout/>
      </div>
    </div>
  );
}