import { useState } from "react";
import "../cart/styles/CartSummary.css";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type CartSummaryProps = {
  items: CartItem[];
};

export default function CartCheckout({ items }: CartSummaryProps)  {

  return (
    <div className="cart-summary">
      {items.map((item) => (
        <div key={item.id} className="cart-summary__row">
          <span className="cart-summary-name">{item.name}</span>
          <span>
            {item.price * item.quantity}
          </span>
        </div>
      ))} 

      <div className="cart-summary__row cart-summary__total">
        <span>Tổng</span>
        <span>{items.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
      </div>

      <div className="cart-summary__form">
        <div className="cart-summary__discount">
          <input type="text" placeholder="Mã giảm giá" />
          <button className="d-btn d-btn-font">
            <span>Áp dụng</span>
          </button>
        </div>

        <a href="/thanh-toan" className="d-btn d-btn-font">
          <span>Tiếp tục</span>
        </a>
        <div className="cart-summary__or">
            <span>hoặc</span>
            </div>
        <a href="/vegie-care" className="d-btn d-btn-font">
          <span>Quay lại</span>
        </a>
      </div>
    </div>
  );
}