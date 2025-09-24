import { Order } from "./OrderStatus";
import OrderItem from "./OrderItem";
import { useState } from "react";
import "../styles/Order.css"
type Props = {
  orders: Order[];
};


export default function OrderList({ orders }: Props) {
  const [orderList, setOrderList] = useState(orders);

  const handleCancelOrder = (id: number) => {
    // Option 1: remove it completely
    setOrderList(prev => prev.filter(order => order.id !== id));
  };

  return (
    <div>
      {orderList.map(order => (
        <OrderItem key={order.id} order={order} onCancel={handleCancelOrder} />
      ))}
    </div>
  );
}
