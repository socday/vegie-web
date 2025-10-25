import { useSearchParams } from "react-router-dom";
import OrderStatus from "./OrderStatus";
import ReviewOrder from "./ReviewOrder";
import ReviewOrderForm from "./ReviewOrderForm";
import "../styles/Order.css";
import { useOrders } from "../../../../context/OrderContext";
import { useEffect, useMemo } from "react";
import { cancelOrder, updateOrdersStatus } from "../../../../router/orderApi";
import { formatOrderDate } from "../../../utils/DateTransfer";

export default function Order() {
  const { orders, refreshOrders, cancelLocalOrder } = useOrders();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = (searchParams.get("tab") as "status" | "review" | "favorite") || "status";
  const orderId = searchParams.get("id");

  const handleTabChange = (tab: "status" | "review" | "favorite", id?: string) => {
    const params: Record<string, string> = {
      section: "orders",
      tab,
    };
    if (id) params.id = id;
    setSearchParams(params);
  };

  useEffect(() => {
    if (orders.length === 0) refreshOrders();
  }, [orders]);

  const handleCancelOrder = async (id: string) => {
    const res = await cancelLocalOrder(id);
    if (res.isSuccess) {
      alert("Đơn hàng đã được hủy thành công.");
    } else {
      alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
    }
  };


const sortedOrders = useMemo(() => {
  return [...orders]
    .map(o => ({
      ...o,
      formattedDate: formatOrderDate(o.date), // human-readable
    }))
    .sort((a, b) => {
      const truncateISO = (iso: string) => iso.replace(/(\.\d{3})\d+/, "$1");
      return new Date(truncateISO(b.date)).getTime() - new Date(truncateISO(a.date)).getTime();
    });
}, [orders]);

  if (currentTab === "review" && orderId) {
    return (
      <div className="orders">
        <ReviewOrderForm orderId={orderId} />
      </div>
    );
  }

  return (
    <div className="orders">
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
            orders={sortedOrders} // ✅ use sorted version here
            onCancel={handleCancelOrder}
            onSwitchTab={handleTabChange}
          />
        )}
        {currentTab === "review" && !orderId && (
          <ReviewOrder
            orders={sortedOrders} // ✅ also sorted
            onSwitchTab={handleTabChange}
          />
        )}
      </div>
    </div>
  );
}