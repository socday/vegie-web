import React, { useState } from "react";
import "../styles/BlindBox.css";
import { updateCartItem } from "../../../router/cartApi";
import { Item } from "../../../router/types/cartResponse";
import { useNavigate } from "react-router-dom";

export default function BlindBox() {
    const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem("userId");
  // Hardcoded Blind Box data
  const box = {
    // id: "3317c3fe-ac82-4f8e-b249-78342ef32912",
    id: "69807b28-0187-4d52-95fe-c6ede9ab412d",
    name: "Blind Box",
    description: "Random mystery box with surprise items",
    price: 150000,
  };

  const [items, setItems] = useState<Item[]>([]);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  
    const handleQuantityChange = async (id: string, newQty: number) => {  if (!userId) return ("Ko lay duoc userid");
    try {
      if (localStorage.getItem("accessToken") === null) {
        navigate("/dang-nhap");
      }
      console.log("Item:", id, "to quantity:", newQty, "name", items.find(i => i.id === id)?.name);
      await updateCartItem(userId, id, newQty);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, initialQuantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
    };
  return (
    <div className="button-container">
      <div className="blindbox-container">
        {/* Left Section */}
        <div className="left-section">
          <div className="title">{box.name}</div>
          <span className="subtitle">Món Tròn Ngẫu Nhiên</span>

          <div className="stars">
            <span className="star">★★★★★</span>
            <span className="rating">(50)</span>
          </div>

          <div className="description">
            <div className="description"> <span className="description-line">Combo của từ 5 - 6 loại rau củ quả</span> <span className="description-line">Phù hợp với khẩu phần ăn ít người từ 3 người trở lại</span> <span className="description-line">Đảm bảo cây đủ dinh dưỡng</span> <span className="description-line">Rau hàng tận vườn, từ nhà vườn</span> </div>
          </div>

          <div className="controls">
            <div className="quantity-control">
              <button className="bb-quantity-btn" onClick={decreaseQuantity}>
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button className="bb-quantity-btn" onClick={increaseQuantity}>
                +
              </button>
            </div>
            <button className="price-btn">
              {(box.price * quantity).toLocaleString()} ₫
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <a href="/retail-package"  className="action-btn mua-le fancy-btn">
            <span className="action-btn-text">Mua lẻ</span>
          </a>

          <a href="weekly-package" className="fancy-btn action-btn mua-theo-tuan">
            <span className="action-btn-text">Mua theo tuần</span>
          </a>

          <button className="fancy-btn action-btn them-gio bb-btn-p"
        onClick={() => handleQuantityChange(box.id, quantity)}>
            <span className="action-btn-text">Thêm vào giỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
