import { createContext, useContext, useState, useEffect } from "react";
import { transformApiOrders } from "../mappers/OrderMapper";
import { getOrder, cancelOrder } from "../router/orderApi";

export type Order = {
  id: string;
  name: string;
  date: string;
  qty: number;
  price: number;
  status: "cho_xac_nhan" | "dang_giao" | "da_giao" | "da_huy";
};

export type CancelOrderResponse = {
  isSuccess: boolean;
  data?: Order;
  message: string;
  exception?: string | null;
};

type OrderContextType = {
  orders: Order[];
  refreshOrders: () => Promise<void>;
  cancelLocalOrder: (id: string) => Promise<CancelOrderResponse>;
};

  const OrderContext = createContext<OrderContextType>({
    orders: [],
    refreshOrders: async () => {},
    cancelLocalOrder: async () => ({
      isSuccess: false,
      message: "Not implemented",
    }),
  });

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token invalid")
        return;
      } 

      const res = await getOrder();
      if (res.isSuccess) {
        const transformed = transformApiOrders(res.data);
        setOrders(transformed);
        localStorage.setItem("orders_cache", JSON.stringify(transformed));
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const cancelLocalOrder = async (id: string): Promise<CancelOrderResponse> => {
    try {
      const res = await cancelOrder(id);

      if (res.isSuccess) {
        setOrders((prev) => {
          const updated = prev.map((order) =>
            order.id === id ? { ...order, status: "da_huy" as const } : order
          );
          localStorage.setItem("orders_cache", JSON.stringify(updated));
          return updated;
        });
      } else {
        console.warn("Cancel order failed on server.");
      }

      // Map to the local Order shape (if we have it) and return a CancelOrderResponse
      const localOrder = orders.find((o) => o.id === id);
      const mappedData = localOrder ? { ...localOrder, status: "da_huy" as const } : undefined;

      return {
        isSuccess: Boolean(res.isSuccess),
        data: mappedData,
        message: res.message,
        exception: res.exception ?? null,
      };
    } catch (err) {
      console.error("Error while canceling order:", err);
      return { isSuccess: false, message: "Error while canceling order" };
    }
  };

  useEffect(() => {
    // Don't fetch orders if user is on admin route
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      return;
    }

    const cached = localStorage.getItem("orders_cache");
    if (cached) {
      try {
        setOrders(JSON.parse(cached));
      } catch (e) {
        // If cache is invalid, fetch fresh data
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
          refreshOrders();
        }
      }
    } else {
      // Only fetch if no cache exists and user is authenticated
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        refreshOrders();
      }
    }
  }, []);

  useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "accessToken") {
      setOrders([]);
      localStorage.removeItem("orders_cache");

      if (e.newValue) {
        refreshOrders();
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

  return (
    <OrderContext.Provider value={{ orders, refreshOrders, cancelLocalOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook for using context
export const useOrders = () => useContext(OrderContext);