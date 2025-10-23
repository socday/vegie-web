import { useSearchParams } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import ReviewOrder from "./ReviewOrder";
import ReviewOrderForm from "./ReviewOrderForm";
import "../styles/Order.css";
import { useOrders } from "../../../../context/OrderContext";
import { useEffect } from "react";

export default function Order() {
  const { orders, refreshOrders } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = (searchParams.get("tab") as "status" | "review" | "favorite") || "status";
  const orderId = searchParams.get("id");

const handleTabChange = (tab: "status" | "review" | "favorite", id?: string) => {
  const params: Record<string, string> = {
    section: "orders", // <── Always include this
    tab,
  };
  if (id) params.id = id;
  setSearchParams(params);
};

  useEffect(() => {
    if (orders.length === 0) refreshOrders();
  }, [orders]);

  const handleCancelOrder = (id: string) => {
    // Optional: update cached orders here if needed
  };

  // 💡 CONDITIONAL RENDER LOGIC
  // 1️⃣ If tab=review and id exists → show ReviewOrderForm
  // 2️⃣ Else → normal tab layout
  if (currentTab === "review" && orderId) {
    return (
      <div className="orders">
        <ReviewOrderForm orderId={orderId} />
      </div>
    );
  }

  return (
    <div className="orders">
      {/* only show tabs if NOT inside review form */}
      <div className="orders__tabs">
        <button
          className={`fancy-btn ${currentTab === "status" ? "active" : ""}`}
          onClick={() => handleTabChange("status")}
        >
          <span>Trạng thái đơn hàng</span>
        </button>
        <button
          className={`fancy-btn ${currentTab === "review" ? "active" : ""}`}
          onClick={() => handleTabChange("review")}
        >
          <span>Đánh giá</span>
        </button>
      </div>

      <div className="orders__content">
        {currentTab === "status" && (
          <OrderStatus
            orders={orders}
            onCancel={handleCancelOrder}
            onSwitchTab={handleTabChange}
          />
        )}
        {currentTab === "review" && !orderId && (
          <ReviewOrder
            orders={orders}
            onSwitchTab={handleTabChange}
          />
        )}
      </div>
    </div>
  );
}