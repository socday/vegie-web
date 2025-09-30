import { Order } from "../components/user/profile/order/OrderStatus";
import { OrderResponse } from "../router/types/orderResponse";

function mapOrderStatus(
  apiStatus: string
): "cho_xac_nhan" | "dang_giao" | "da_giao" | "da_huy" {
  switch (apiStatus) {
    case "Pending":
      return "cho_xac_nhan";
    case "Processing":
      return "dang_giao";
    case "Completed":
      return "da_giao";
    case "Cancelled":
      return "da_huy";
    default:
      return "cho_xac_nhan";
  }
}

export function transformApiOrders(apiOrders: OrderResponse["data"]): Order[] {
  return apiOrders.map(o => {
    const firstItem = o.details[0];
    return {
      id: o.id,
      name: firstItem?.boxName ?? "N/A",
      date: new Date().toISOString().split("T")[0], // replace with real date if backend adds it
      qty: o.details.reduce((sum, d) => sum + d.quantity, 0),
      price: o.finalPrice,
      status: mapOrderStatus(o.status),
    };
  });
}