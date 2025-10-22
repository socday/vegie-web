import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";
import "./styles/FinishGiftBox.css";
// Import all images statically
import {giftbox} from "../../assets/images/mascot-giftbox-01.png";
export default function FinishGiftBox() {
  const navigate = useNavigate();



  // Handle continue button
  const handleContinue = () => {
    navigate("/");

    // navigate("/gift-preview"); 
  };



  return (
    <div className="fruit-selection-page">
      <div className="main-container">
        {/* LEFT SIDE */}
        <div className="fnb-left">
          <div className="fruit-selection-title-display">
            <h1 className="finish-gift-box-title" style={{ color: "#91CF43" }}>
              Hoàn thành
            <br/>Gift Box
            </h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions">
            <p>Bạn đã hoàn thành 90% rồi nè. </p>
                <p>để người thân yêu của bạn biết rằng họ luôn được trân trọng.</p>
        </div>
            <button className="letter-continue-btn d-btn d-btn-font" onClick={handleContinue}>
            <span>Thanh toán ngay</span>
        </button>

        
        </div>

        {/* RIGHT SIDE */}
        <div className="fnb-right">
          <div className="fnb-display-area">
            <img src="../../assets/images/mascot-giftbox-01.png" alt="Mascot Gift Box" className="mascot-giftbox-image" />
          </div>
        </div>
      </div>
    </div>
  );
}