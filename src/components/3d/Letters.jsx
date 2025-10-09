import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";
// Import all images statically
import letter1 from "../../assets/images/letter1.png";
import letter2 from "../../assets/images/letter2.png";
import letter3 from "../../assets/images/letter3.png";

// Create a lookup object
const letters = {
  1: letter1,
  2: letter2,
  3: letter3,
};

export default function Letters() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(1); // default image 1

  // Handle text change
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle continue button
  const handleContinue = () => {
    if (message.trim() === "") {
      alert("Vui lòng nhập lời nhắn trước khi tiếp tục!");
      return;
    }

    console.log("User message:", message);
    navigate("/gift-preview", { state: { message, selectedImage } });
  };

  // Handle number button click
  const handleImageChange = (num) => {
    setSelectedImage(num);
  };

  return (
    <div className="fruit-selection-page">
      <div className="main-container">
        {/* LEFT SIDE */}
        <div className="fruit-selection-left">
          <div className="fruit-selection-title-display">
            <h1 className="gift-box-title" style={{ color: "#91CF43" }}>
              Letter
            </h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions">
            <p>Một lá thư nhỏ xinh trong gift box – món quà bất ngờ</p>
            <p>để người thân yêu của bạn biết rằng họ luôn được trân trọng.</p>
          </div>

          <div className="letter-input-container">
            <textarea
              className="letter-input"
              placeholder="Hãy viết lời nhắn tại đây!"
              value={message}
              onChange={handleChange}
            />
          </div>

          {/* === New number buttons === */}
          <div className="number-button-group">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`number-btn ${
                  selectedImage === num ? "active" : ""
                }`}
                onClick={() => handleImageChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="fruit-selection-right">
          <div className="letter-display-area">
            <img
            src={letters[selectedImage]}
            alt={`Letter Style ${selectedImage}`}
            className="letter-preview-image"
            />
            <button className="letter-continue-btn d-btn d-btn-font" onClick={handleContinue}>
              <span>Tiếp tục</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}