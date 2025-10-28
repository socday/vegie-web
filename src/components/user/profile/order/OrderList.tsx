import OrderItem from "./OrderItem";
import { Order } from "../../../../context/OrderContext";

type OrderListProps = {
  orders: Order[];
  onCancel?: (id: string) => void;
  onSwitchTab: (tab: "status" | "review" | "favorite", id?: string) => void;
  review?: boolean;
};

export default function OrderList({ orders, onCancel, onSwitchTab, review }: OrderListProps) {
  return (
    <>
      {orders.map(order => (
        <OrderItem
          key={order.id}
          order={order}
          onCancel={onCancel}
          onSwitchTab={onSwitchTab}
          review={review}
        />
      ))}
    </>
  );
}