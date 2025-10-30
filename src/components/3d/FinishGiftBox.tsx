import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";
import "./styles/FinishGiftBox.css";
import giftbox from "../../assets/images/mascot-giftbox-01.png"; // ✅ Correct image import
import backgroundStar from "../../assets/images/giftbox-01.png";
import { createGiftBoxOrder } from "../../router/orderApi";
import { addToCart } from "../../router/cartApi";

// Type for received state
interface FinishGiftBoxLocationState {
  message?: string;
  selectedLetter?: number;
  selectedBox?: number;
  selectedFruits?: Record<string, number>;
}

export default function FinishGiftBox() {
  const navigate = useNavigate();
  const location = useLocation() as { state: FinishGiftBoxLocationState };

  // Get state safely
  const message = location.state?.message || "";
  const selectedLetter = location.state?.selectedLetter || 1;
  const selectedBox = location.state?.selectedBox || 1;
  const selectedFruits = location.state?.selectedFruits || {};



  const handleContinue = async () => {
    const userId = localStorage.getItem("userId") || "";

    if (!userId) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    const vegetables: string[] = Object.keys(selectedFruits);

    const fruitsString = Object.entries(selectedFruits)
      .map(([name, qty]) => `${name} ${qty}`)
      .join(", ");

    const fullMessage = `${message} | Letter: ${selectedLetter}, Box: ${selectedBox}${fruitsString ? " | " + fruitsString : ""}`;

    try {
      const result = await addToCart({
        userId,
        vegetables,
        greetingMessage: fullMessage,
        boxDescription: selectedBox?.toString() || "",
        letterScription: selectedLetter?.toString() || "",
        quantity: 1
      });

      if (result.isSuccess) {
        navigate("/gio-hang");
        // console.log("Added to cart:", result.data);
      } else {
        if (result.isSuccess === false) {
    const errorMessage =
      typeof result.data === "string"
        ? result.data
        : JSON.stringify(result.data, null, 2);
    alert(errorMessage || "Thêm vào giỏ hàng không thành công");
  } 
        else{
          alert("Thêm vào giỏ hàng không thành công");
        }
        // console.error("Failed to add to cart:", result.message);
      }
    } catch (err) {
      // console.error("API error:", err);
    }
  };

  return (
    <div className="fruit-selection-page">
      <div className="finish-giftbox-container">
        {/* LEFT SIDE */}

        <div className="fnb-left">
          <div className="finish-selection-title-display">
            <h1 className="finish-giftbox-title" >
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