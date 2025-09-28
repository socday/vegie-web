import React, { useState } from "react";
import "../../../../css/BlindBox.css";

export default function BlindBox() {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="button-container">
      

    <div className="blindbox-container">
      <div className="left-section">
        <div className="title">Blind Box</div>
        <span className="subtitle">Món Tròn Ngẫu Nhiên</span>

        <div className="stars">
          <span className="star">★★★★★</span>
          <span className="rating">(50)</span>
        </div>

        <div className="description">
          <span className="description-line">Combo của từ 5 - 6 loại rau củ quả</span>
          <span className="description-line">Phù hợp với khẩu phần ăn ít người từ 3 người trở lại</span>
          <span className="description-line">Đảm bảo cây đủ dinh dưỡng</span>
          <span className="description-line">Rau hàng tận vườn, từ nhà vườn</span>
        </div>

        <div className="controls">
          <div className="quantity-control">
            <button className="quantity-btn" onClick={decreaseQuantity}>−</button>
            <span className="quantity-display">{quantity}</span>
            <button className="quantity-btn" onClick={increaseQuantity}>+</button>
          </div>
          <button className="price-btn">giá tiền</button>
        </div>
      </div>

      <div className="right-section">
        <button className="action-btn mua-le">
          <span className="action-btn-text">Mua lẻ</span>
        </button>

        <button className="action-btn mua-theo-tuan">
          <span className="action-btn-text">Mua theo tuần</span>
        </button>

        <button className="action-btn them-gio">
          <span className="action-btn-text">Thêm vào giỏ</span>
        </button>
      </div>
    </div>
 </div>
  );   
}
