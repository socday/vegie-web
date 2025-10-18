import { Order } from "./Order";
import OrderItem from "./OrderItem";

type Props = {
  orders: Order[];
  onCancel?: (id: string) => void;
  review?: boolean;
};

export default function OrderList({ orders, onCancel, review   }: Props) {
  return (
    <div>
      {orders.map(order => (
        <OrderItem key={order.id} order={order} onCancel={onCancel} review={review} />
      ))}
    </div>
  );
}