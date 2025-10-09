import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OpenBox3DViewer from './OpenBox3DViewer';

// Type cho fruit animation
interface FruitAnimationState {
  fruitType: string;
  isActive: boolean;
  onComplete: () => void;
}

// Type cho remove fruit
interface RemoveFruitState {
  fruitType: string;
}

export default function FruitSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy box đã chọn từ state hoặc default là 1
  const [selectedBox] = useState(location.state?.selectedBox || 1);
  
  // Debug: Log để kiểm tra box đã chọn
  console.log('Selected box from /box-3d:', selectedBox);
  
  const [selectedFruits, setSelectedFruits] = useState({
    'Cà rốt': 0,
    'Súp lơ': 0,
    'Bắp': 0,
    'Cà chua': 0
  });

  // State cho hiệu ứng trái cây rơi
  const [fruitAnimation, setFruitAnimation] = useState<FruitAnimationState | null>(null);
  const [removeFruit, setRemoveFruit] = useState<RemoveFruitState | null>(null);

  // const handleQuantityChange = (fruit, change) => {
  //   setSelectedFruits(prev => {
  //     const newQuantity = prev[fruit] + change;
  //     if (newQuantity >= 0 && newQuantity <= 3) {
  //       // Nếu là thêm trái cây (change > 0), trigger animation
  //       if (change > 0) {
  //         console.log('Triggering fruit animation for:', fruit);
  //         setFruitAnimation({
  //           fruitType: fruit,
  //           isActive: true,
  //           onComplete: () => {
  //             console.log('Fruit animation completed for:', fruit);
  //             setFruitAnimation(null);
  //           }
  //         });
  //       }
        
  //       // Nếu là bớt trái cây (change < 0), trigger remove
  //       if (change < 0) {
  //         console.log('Triggering fruit removal for:', fruit);
  //         setRemoveFruit({
  //           fruitType: fruit
  //         });
  //         // Reset removeFruit sau 100ms
  //         setTimeout(() => setRemoveFruit(null), 100);
  //       }
  //       return { ...prev, [fruit]: newQuantity };
  //     }
  //     return prev;
  //   });
  // };

  const handleQuantityChange = (fruit: string, change: number) => {
  setSelectedFruits(prev => {
    const newQuantity = prev[fruit] + change;

    // Each type can be from 0 to 3
    if (newQuantity < 0 || newQuantity > 3) return prev;

    return { ...prev, [fruit]: newQuantity };
  });
};

  const handleContinue = () => {
    // Navigate to next page
    console.log('Selected fruits:', selectedFruits);
  };

  return (
    <div className="fruit-selection-page">
      {/* Container chính chứa tất cả các elements */}
      <div className="main-container">
        <div className="fruit-selection-left">
          {/* Title GIFT BOX - Sử dụng font Nighty DEMO */}
          <div className="fruit-selection-title-display">
          <h1 className="gift-box-title" style={{ color: "#91CF43" }}>
            Gift Box </h1>
          <div className="title-line"></div>
          </div>
          
          {/* 3 dòng text hướng dẫn */}
          <div className="instructions">
            <p>Hãy chọn <strong>TỐI ĐA 5 loại</strong> trong danh sách sản phẩm</p>
            <p><strong>Một loại số lượng tối đa là 3</strong></p>
            <p>Box được đóng gói thùng deco sạch sẽ</p>
          </div>
        
          {/* Khung xanh chứa danh sách trái cây */}
          <div className="product-selection-container">
            <div className="product-list">
              {Object.keys(selectedFruits).map((fruit) => (
                <div key={fruit} className="product-item">
                  <span className="fruit-name">{fruit}</span>
                  <div className="cart-quantity">
                    <button 
                      className="cart-quantity-button cart-decrease-style"
                      onClick={() => handleQuantityChange(fruit, -1)}
                      disabled={selectedFruits[fruit] === 0}
                    >
                      -
                    </button>
                    
                    <span>{selectedFruits[fruit]}</span>
                    <button 
                      className="cart-quantity-button cart-increase-style"
                      onClick={() => handleQuantityChange(fruit, 1)}
                      disabled={selectedFruits[fruit] === 3}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Khung xám bên phải để hiển thị box 3D */}
        <div className="fruit-selection-right">
          <div className="display-area">
            <div className="box-preview">
              {/* Hiển thị box 3D đã chọn ở dạng mở với hiệu ứng trái cây */}
              <OpenBox3DViewer 
                currentBox={selectedBox} 
                fruitAnimation={fruitAnimation}
                removeFruit={removeFruit}
              />
            </div>
            
            {/* Button Tiếp tục */}
            <button className="continue-btn" onClick={handleContinue}>
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}