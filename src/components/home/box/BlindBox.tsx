import React, { useState } from "react";
import "../styles/BlindBox.css";
import { addCartItem, updateCartItem } from "../../../router/cartApi";
import { Item } from "../../../router/types/cartResponse";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function BlindBox() {
    const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem("userId");
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
  // Hardcoded Blind Box data
  const box = {
    id: "ca108cad-a026-4dea-b3d1-62f7fcc51ef9",
    // id: "69807b28-0187-4d52-95fe-c6ede9ab412d",
    name: "Blind Box",
    description: "Random mystery box with surprise items",
    price: 70000,
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
      await addCartItem(userId, id, newQty);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, initialQuantity: newQty } : item
        )
      );
      alert(`Thêm thành công ${box.name} x ${newQty}`);
    } catch (err) {
      alert("Thêm vào giỏ hàng không thành công do lỗi hệ thống");
    }
    };
  
  
  return (
    <div className="bb-button-container">
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
            <div className="description"> 
              <span className="description-line">Combo của từ 5 - 6 loại rau củ quả</span>
             <span className="description-line">Phù hợp với khẩu phần ăn ít người từ 3 người trở lại</span> 
             <span className="description-line">Đảm bảo cây đủ dinh dưỡng</span> 
             <span className="description-line">Rau hàng tận vườn, từ nhà vườn</span> </div>
          </div>

          <div className="controls">
            <div className="quantity-control">
              <button className="bb-quantity-btn bb-l" onClick={decreaseQuantity}>
                −
              </button>
              <span className="quantity-display">{quantity}</span>
              <button className="bb-quantity-btn bb-r" onClick={increaseQuantity}>
                +
              </button>
            </div>
            <button className="price-btn bb-price-btn">
              <span>
                {(box.price * quantity).toLocaleString()} ₫
                </span>
            </button>
          </div>
          {isMobile && <>
          <div className="bb-form-button">
          <a href="/retail-package"  className="action-btn mua-le fancy-btn bb-btn-m">
            <span className="action-btn-text">Mua lẻ</span>
          </a>

          <a href="weekly-package" className="fancy-btn action-btn mua-theo-tuan bb-btn-m">
            <span className="action-btn-text">Mua theo tuần</span>
          </a>

          <button className="fancy-btn action-btn them-gio bb-btn-p bb-btn-m"
        onClick={() => handleQuantityChange(box.id, quantity)}>
            <span className="action-btn-text">Thêm vào giỏ</span>
          </button>
          </div>
          </>}
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
