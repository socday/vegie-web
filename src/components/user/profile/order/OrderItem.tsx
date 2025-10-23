import { useState } from "react";
import "../styles/Order.css";
import "./styles/OrderItem.css";
import { useMediaQuery } from "react-responsive";
import { Order } from "../../../../context/OrderContext";
import { useSearchParams } from "react-router-dom";

type Props = {
  order: Order;
  onCancel?: (id: string) => void; 
  onSwitchTab?: (tab: "status" | "review" | "favorite", id?: string) => void;
  review?: boolean;
};

export default function OrderItem({ order, onCancel, onSwitchTab, review}: Props) {
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
    if (!onCancel) {
      console.warn("onCancel function is not provided");
      return;
    }
    onCancel(order.id);
    setShowPopup(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleReviewClick = () => {
    if (onSwitchTab) {
      onSwitchTab("review", order.id);
    } else {
      console.warn("onSwitchTab not provided");
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' }); 

  return (
    <>
      <div className={`order-item ${review ? 'order-review' : ''}`}>
        <div className="order-left">
          <div className="product-image"></div>
          <div className="product-info">
            <h3>{order.name}</h3>
            {isDesktop && (
              <p>Ngày đặt hàng: {order.date}</p>
            )}
            {isMobile && (
              <p>
                Ngày đặt hàng:<br />
                {order.date}
              </p>
            )}
            <p>Số lượng: {order.qty}</p>
          </div>
        </div>

        <div className="order-right">
          {review ? (
            <button className="order-price fancy-btn" onClick={handleReviewClick}>
              <span>Đánh giá</span>
            </button>
          ) : (
            <div className="order-price">
              <span>Giá tiền: {order.price.toLocaleString()} đ</span>
            </div>
          )}

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
                <span>Hủy</span>
              </button>
              <button className="d-btn d-btn-font" onClick={handleClosePopup}>
                <span>Không hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}