import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";
import "./styles/FinishGiftBox.css";
import giftbox from "../../assets/images/mascot-giftbox-01.png"; // ✅ Correct image import
import { createGiftBoxOrder } from "../../router/orderApi";

// Type for received state
interface FinishGiftBoxLocationState {
  message?: string;
  selectedImage?: number;
  selectedBox?: number;
  selectedFruits?: Record<string, number>;
}

export default function FinishGiftBox() {
  const navigate = useNavigate();
  const location = useLocation() as { state: FinishGiftBoxLocationState };

  // Get state safely
  const message = location.state?.message || "";
  const selectedImage = location.state?.selectedImage || 1;
  const selectedBox = location.state?.selectedBox || 1;
  const selectedFruits = location.state?.selectedFruits || {};



  const handleContinue = async () => {

  const result = await createGiftBoxOrder();
    console.log(result);

    if (result.isSuccess) {
      alert("Order created successfully!");
      // navigate to next page
    } else {
      alert("Failed to create order.");
    }
  };

  return (
    <div className="fruit-selection-page">
      <div className="main-container">
        {/* LEFT SIDE */}
        <div className="fnb-left">
          <div className="fruit-selection-title-display">
            <h1 className="finish-gift-box-title" style={{ color: "#91CF43" }}>
              Hoàn thành
              <br />
              Gift Box
            </h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions">
            <p>Bạn đã hoàn thành 90% rồi nè.</p>
            <p>
              Để người thân yêu của bạn biết rằng họ luôn được trân trọng.
            </p>
          </div>


          <button
            className="letter-continue-btn d-btn d-btn-font"
            onClick={handleContinue}
          >
            <span>Thanh toán ngay</span>
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="fnb-right">
          <div className="fnb-display-area">
            <img
              src={giftbox}
              alt="Mascot Gift Box"
              className="mascot-giftbox-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}