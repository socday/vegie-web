import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OpenBox3DViewer from './OpenBox3DViewer';

type FruitType = 'Cà rốt' | 'Súp lơ' | 'Bắp' | 'Cà chua';

interface FruitsState {
  'Cà rốt': number;
  'Súp lơ': number;
  'Bắp': number;
  'Cà chua': number;
}


interface FruitAnimationState {
  fruitType: string;
  isActive: boolean;
  onComplete: () => void;
}

interface RemoveFruitState {
  fruitType: string;
}

export default function FruitSelection() {
  const [selectedFruits, setSelectedFruits] = useState<FruitsState>({
    'Cà rốt': 0,
    'Súp lơ': 0,
    'Bắp': 0,
    'Cà chua': 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [selectedBox] = useState(location.state?.selectedBox || 1);

  const [fruitAnimation, setFruitAnimation] = useState<FruitAnimationState | null>(null);
  const [removeFruit, setRemoveFruit] = useState<RemoveFruitState | null>(null);

  const handleQuantityChange = (fruit: FruitType, change: number) => {
  setSelectedFruits(prev => {
    const newQuantity = prev[fruit] + change;

    // If the new quantity is greater than max (3), ignore
    if (newQuantity > 3) return prev;

    // --- NEW LOGIC: if below 0, trigger remove animation and reset to 0 ---
    if (newQuantity < 0) {
      console.log(`Removing all ${fruit} from box because quantity < 0`);
      setRemoveFruit({ fruitType: fruit });
      setTimeout(() => setRemoveFruit(null), 100);

      // Reset to 0 to avoid negative count
      return { ...prev, [fruit]: 0 };
    }

    // --- Add fruit animation when increasing ---
    if (change > 0) {
      console.log('Triggering fruit animation for:', fruit);
      setFruitAnimation({
        fruitType: fruit,
        isActive: true,
        onComplete: () => {
          console.log('Fruit animation completed for:', fruit);
          setFruitAnimation(null);
        },
      });
    }

    // --- Remove fruit animation when decreasing normally ---
    if (change < 0 && newQuantity >= 0) {
      console.log('Triggering single fruit removal for:', fruit);
      setRemoveFruit({ fruitType: fruit });
      setTimeout(() => setRemoveFruit(null), 100);
    }

    // Update fruit quantity normally
    return { ...prev, [fruit]: newQuantity };
  });
  }


  const handleContinue = () => {
    console.log('Selected fruits:', selectedFruits);
    navigate('/box-3d');
  };

  return (
    <div className="fruit-selection-page">
      <div className="main-container">
        <div className="fruit-selection-left">
          <div className="fruit-selection-title-display">
            <h1 className="gift-box-title" style={{ color: "#91CF43" }}>Gift Box</h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions">
            <p>Hãy chọn <strong>TỐI ĐA 5 loại</strong> trong danh sách sản phẩm</p>
            <p><strong>Một loại số lượng tối đa là 3</strong></p>
            <p>Box được đóng gói thùng deco sạch sẽ</p>
          </div>

          <div className="product-selection-container">
            <div className="product-list">
{(Object.keys(selectedFruits) as (keyof FruitsState)[]).map((fruit) => (
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

        <div className="fruit-selection-right">
          <div className="display-area">
            <div className="box-preview">
              <OpenBox3DViewer
                currentBox={selectedBox}
                fruitAnimation={fruitAnimation}
                removeFruit={removeFruit}
              />
            </div>
            <button className="continue-btn" onClick={handleContinue}>Tiếp tục</button>
          </div>
        </div>
      </div>
    </div>
  );
}