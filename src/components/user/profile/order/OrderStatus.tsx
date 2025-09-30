import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import "../styles/Order.css";
import { getOrder } from "../../../../router/orderApi";
import { transformApiOrders } from "../../../../mappers/OrderMapper";

export type Order = {
  id: string;  // UUID from API
  name: string;
  date: string;
  qty: number;
  price: number;
  status: "cho_xac_nhan" | "dang_giao" | "da_giao" | "da_huy";
};

export default function OrderStatus() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getOrder();
        if (res.isSuccess) {
          setOrders(transformApiOrders(res.data));
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    }
    fetchOrders();
  }, []);

  const handleCancelOrder = (id: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: "da_huy" } : order
      )
    );
  };

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

      <OrderList orders={filteredOrders} onCancel={handleCancelOrder} />
    </div>
  );
}