import { useState } from "react";
import OrderStatus from "./OrderStatus";
import "../styles/Order.css"

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"status" | "review" | "favorite">("status");

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
        <button 
          className={`fancy-btn ${activeTab === "favorite" ? "active " : ""}`} 
          onClick={() => setActiveTab("favorite")}
        >
          <span>    
            Yêu thích</span>
        </button>
      </div>

      <div className="orders__content">
        {activeTab === "status" && <OrderStatus />}
        {activeTab === "review" && <div>Đánh giá</div>}
        {activeTab === "favorite" && <div>Yêu thích</div>}
      </div>
    </div>
  );
}