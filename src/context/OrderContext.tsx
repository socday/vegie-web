import { createContext, useContext, useState, useEffect } from "react";
import { transformApiOrders } from "../mappers/OrderMapper";
import { getOrder } from "../router/orderApi";

export type Order = {
  id: string;
  name: string;
  date: string;
  qty: number;
  price: number;
  status: "cho_xac_nhan" | "dang_giao" | "da_giao" | "da_huy";
};

type OrderContextType = {
  orders: Order[];
  refreshOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType>({
  orders: [],
  refreshOrders: async () => {},
});

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch once on mount
  useEffect(() => {
    if (orders.length === 0) {
      refreshOrders();
    }
  }, []);

  const refreshOrders = async () => {
    try {
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

  // Load from localStorage (optional, faster)
  useEffect(() => {
    const cached = localStorage.getItem("orders_cache");
    if (cached) {
      setOrders(JSON.parse(cached));
    }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);