import { useState } from "react";
import "../cart/styles/CartSummary.css";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartSummaryProps = {
  items: CartItem[];
  mode: "checkout" | "payment";
};

export default function CartCheckout({ items, mode}: CartSummaryProps )  {

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
        {mode === "payment" && (

            <div className="cart-shipping cart-summary__row">
                <span className="cart-summary-name">
                    Phí giao hàng
                </span>
                <span>
                    100
                </span>
            </div>
        )}


        <div className="cart-summary__row cart-summary__total">
            <span>Tổng</span>
            <span>{items.reduce((sum, item) =>sum + item.price * item.quantity, 0)+100}</span>
        </div>

        <div className="cart-summary__form">
            <div className="cart-summary__discount">
            <input type="text" placeholder="Mã giảm giá" />
            <button className="d-btn d-btn-font">
                <span>Áp dụng</span>
            </button>
            </div>
                {mode === "checkout" ? (
                <>
                    <a href="/thanh-toan" className="d-btn d-btn-font">
                    <span>Tiếp tục</span>
                    </a>
                    <div className="cart-summary__or">
                        <span>hoặc</span>
                        </div>
                    <a href="/vegie-care" className="d-btn d-btn-font">
                    <span>Quay lại</span>
                    </a>
                </>
            ) : (
                <>
                    <a href="/thanh-toan" className="d-btn d-btn-font">
                    <span>Tiếp tục</span>
                    </a>
                    <div className="cart-summary__or">
                        <span>hoặc</span>
                        </div>
                    <a href="/gio-hang" className="d-btn d-btn-font">
                    <span>Xem lại giỏ hàng</span>
                    </a>
                </>
            )}
        </div>
    </div>
    );
}