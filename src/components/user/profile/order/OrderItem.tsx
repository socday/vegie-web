import { useState } from "react";
import { Order } from "./OrderStatus";
import "../styles/Order.css";
import "./OrderItem.css";

type Props = {
    order: Order;
    onCancel: (id: string) => void; 
};

export default function OrderItem({ order, onCancel }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  const statusLabel: Record<Order["status"], string> = {
    cho_xac_nhan: "Chờ xác nhận",
    dang_giao: "Đang giao hàng",
    da_giao: "Đã giao hàng",
    da_huy: "Đã hủy đơn",
  };

  const handleCancelClick = () => {
    setShowPopup(true);
  };

  const handleConfirmCancel = () => {
    onCancel(order.id);
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="order-item">
        <div className="order-left">
          <div className="product-image"></div>
          <div className="product-info">
            <h3>{order.name}</h3>
            <p>Ngày đặt hàng: {order.date}</p>
            <p>Số lượng: {order.qty}</p>
          </div>
        </div>

        <div className="order-right">
          <div className="order-price">
            <span>Giá tiền: {order.price.toLocaleString()} đ</span>
          </div>
          <div className="order-actions">
            {order.status === "cho_xac_nhan" ? (
              <>
                <button className="fancy-btn active">
                  <span>{statusLabel[order.status]}</span>
                </button>
                <button className="fancy-btn cancel" onClick={handleCancelClick}>
                  <span>Hủy đơn</span>
                </button>
              </>
            ) : (
              <button className="fancy-btn active">
                <span>{statusLabel[order.status]}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>
              Bạn có muốn hủy đơn <strong>{order.name}</strong> không?
            </p>
            <div className="popup-actions">
              <button className="d-btn d-btn-font" onClick={handleConfirmCancel}>
                <span>
                    Hủy</span>
              </button>
              <button className="d-btn d-btn-font" onClick={handleClosePopup}>
                <span>
                    Không hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}