import { useEffect, useState } from "react";
import OrderStatus from "./OrderStatus";
import "../styles/Order.css"
import ReviewOrder from "./ReviewOrder";
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

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"status" | "review" | "favorite">("status");

  const handleSwitchTab = (tab: "status" | "review" | "favorite") => {
  setActiveTab(tab);
  };

  const [orders, setOrders] = useState<Order[]>([]);

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

  return (
    <div className="orders">
      <div className="orders__tabs">
        <button 
          className={`fancy-btn ${activeTab === "status" ? "active " : ""}`} 
          onClick={() => setActiveTab("status")}
        >
          <span>
            Trạng thái đơn hàng</span>
        </button>
        <button 
          className={`fancy-btn ${activeTab === "review" ? "active " : ""}`} 
          onClick={() => setActiveTab("review")}
        >
         <span>
            Đánh giá</span> 
        </button>
        {/* <button 
          className={`fancy-btn ${activeTab === "favorite" ? "active " : ""}`} 
          onClick={() => setActiveTab("favorite")}
        >
          <span>    
            Yêu thích</span>
        </button> */}
      </div>

      <div className="orders__content">
        {activeTab === "status" && <OrderStatus orders={orders} onCancel={handleCancelOrder} onSwitchTab={handleSwitchTab} />}
        {activeTab === "review" && <ReviewOrder orders={orders} onSwitchTab={handleSwitchTab} />}
        {/* {activeTab === "favorite" && <div>Yêu thích</div>} */}
      </div>
    </div>
  );
}