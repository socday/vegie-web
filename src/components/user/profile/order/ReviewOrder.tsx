import React, { useEffect, useState } from "react";
import "../styles/Order.css";
import OrderList from "./OrderList";
import { getOrder } from "../../../../router/orderApi";
import { transformApiOrders } from "../../../../mappers/OrderMapper";
import { Order } from "../../../../context/OrderContext";

type Props = {
    orders: Order[];
    onSwitchTab: (tab: "status" | "review" | "favorite") => void;
}
export default function ReviewOrder({ orders, onSwitchTab }: Props) {

    const [filter, setFilter] = useState<"all" | Order["status"]>("da_giao");
    const filteredOrders =
        filter === "all" ? orders : orders.filter(order => order.status === filter);
    return (
        <div className="orders-list-items">
            <OrderList orders={filteredOrders} onSwitchTab={onSwitchTab} review={true} />
        </div>
    )
}