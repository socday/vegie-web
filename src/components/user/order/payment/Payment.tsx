import { useState } from "react";
import "../cart/styles/Cart.css"
import OrderConfirmation from "./OrderConfirm";
import CartCheckout from "../cart/CartCheckout";
type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function Payment() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "12345678912345678912345678912345678912345678912345678912345678912321321321113uh2139812h4914h1298u2h1b391h38921h38912h3198", price: 999, image: "/images/laptop.png", quantity: 10 },
    { id: 2, name: "Headphones", price: 199, image: "/images/headphones.png", quantity: 2 },

    { id: 1, name: "12345678912345678912345678912345678912345678912345678912345678912321321321113uh2139812h4914h1298u2h1b391h38921h38912h3198", price: 999, image: "/images/laptop.png", quantity: 10 },
    { id: 1, name: "12345678912345678912345678912345678912345678912345678912345678912321321321113uh2139812h4914h1298u2h1b391h38921h38912h3198", price: 999, image: "/images/laptop.png", quantity: 10 },
    { id: 2, name: "Headphones", price: 199, image: "/images/headphones.png", quantity: 2 },
    { id: 2, name: "Headphones", price: 199, image: "/images/headphones.png", quantity: 2 },
  ]);

  return (
    <div className="cart">
      <div className="cart-item-page">

       

        <OrderConfirmation/>

      </div>
      <div className="cart-checkout-page">
        <CartCheckout items={items} mode="payment"/>
      </div>
    </div>
  );
}