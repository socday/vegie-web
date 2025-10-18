import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import "../styles/Order.css";
import { Order } from "./Order";


type Props = {
  orders: Order[];
  onCancel: (id: string) => void;
};

export default function OrderStatus({ orders, onCancel }: Props) {
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");




  const filteredOrders =
    filter === "all" ? orders : orders.filter(order => order.status === filter);

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

      <OrderList orders={filteredOrders} onCancel={onCancel} />
    </div>
  );
}