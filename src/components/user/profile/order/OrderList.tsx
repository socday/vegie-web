import OrderItem from "./OrderItem";
import { Order } from "./OrderStatus";

type Props = {
  orders: Order[];
  onCancel: (id: number) => void;
};

export default function OrderList({ orders, onCancel }: Props) {
  return (
    <div>
      {orders.map(order => (
        <OrderItem key={order.id} order={order} onCancel={onCancel} />
      ))}
    </div>
  );
}