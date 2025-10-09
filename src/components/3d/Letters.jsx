import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/FruitSelection.css';
import './styles/letters.css';

export default function Letters() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Track user typing
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // When user clicks “Tiếp tục”
  const handleContinue = () => {
    if (message.trim() === "") {
      alert("Vui lòng nhập lời nhắn trước khi tiếp tục!");
      return;
    }

    console.log("User message:", message);

    // Go to next page and transfer data
    navigate("/gift-preview", { state: { message } });
  };

  return (
    <div className="fruit-selection-page">
      <div className="main-container">
        <div className="fruit-selection-left">
          {/* Title */}
          <div className="fruit-selection-title-display">
            <h1 className="gift-box-title" style={{ color: "#91CF43" }}>
              Letter
            </h1>
            <div className="title-line"></div>
          </div>

          {/* Instructions */}
          <div className="instructions">
            <p>Một lá thư nhỏ xinh trong gift box – món quà bất ngờ</p>
            <p>để người thân yêu của bạn biết rằng họ luôn được trân trọng.</p>
          </div>

          {/* Textarea input (no send button) */}
          <div className="letter-input-container">
            <textarea
              className="letter-input"
              placeholder="Hãy viết lời nhắn tại đây!"
              value={message}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="fruit-selection-right">
          <div className="display-area">
            {/* Continue button now handles sending + navigation */}
            <button className="continue-btn" onClick={handleContinue}>
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}