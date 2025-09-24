import { useState } from "react";
import OrderList from "./OrderList";
import "../styles/Order.css"

export type Order = {
  id: number;
  name: string;
  date: string;
  qty: number;
  price: number;
  status: "cho_xac_nhan" | "dang_giao" | "da_giao" | "da_huy";
};

const fakeOrders: Order[] = [
  { id: 1, name: "Sản phẩm A", date: "2025-09-20", qty: 2, price: 200000, status: "cho_xac_nhan" },
  { id: 2, name: "Sản phẩm B", date: "2025-09-19", qty: 1, price: 150000, status: "dang_giao" },
  { id: 3, name: "Sản phẩm C", date: "2025-09-18", qty: 3, price: 100000, status: "da_huy" },
  { id: 4, name: "Sản phẩm D", date: "2025-09-18", qty: 3, price: 100000, status: "da_giao" },
];

export default function OrderStatus() {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const filteredOrders =
    filter === "all" ? fakeOrders : fakeOrders.filter(order => order.status === filter);

  return (
    <div className="orders-list-items">
      <div className="sub-tabs">
        <button
            className={`fancy-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
        >
            <span>Tất cả</span>
        </button>

        <button
            className={`fancy-btn ${filter === "cho_xac_nhan" ? "active" : ""}`}
            onClick={() => setFilter("cho_xac_nhan")}
        >
            <span>Chờ xác nhận</span>
        </button>

        <button
            className={`fancy-btn ${filter === "dang_giao" ? "active" : ""}`}
            onClick={() => setFilter("dang_giao")}
        >
            <span>Đang giao hàng</span>
        </button>

        <button
            className={`fancy-btn ${filter === "da_giao" ? "active" : ""}`}
            onClick={() => setFilter("da_giao")}
        >
            <span>Đã giao hàng</span>
        </button>

        <button
            className={`fancy-btn ${filter === "da_huy" ? "active" : ""}`}
            onClick={() => setFilter("da_huy")}
        >
            <span>Đã hủy</span>
        </button>
        </div>


      <OrderList orders={filteredOrders} />
      <div className="hidden-order">
        <p> </p>
      </div>
    </div>
  );
}