import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";

// Import all images statically
import letter1 from "../../assets/images/letter1.png";
import letter2 from "../../assets/images/letter2.png";
import letter3 from "../../assets/images/letter3.png";

// Lookup object
// Create a lookup object
const letters: Record<number, string> = {
  1: letter1,
  2: letter2,
  3: letter3,
};
// Define type for location state
interface LettersLocationState {
  selectedBox?: number;
  selectedFruits: Record<string, number>;
}

export default function Letters() {
  const navigate = useNavigate();
  const location = useLocation() as { state: LettersLocationState };

  // Get passed state safely
  const selectedBox = location.state?.selectedBox || 1;
  const selectedFruits = location.state?.selectedFruits ;

    console.log("Selected fruits:", selectedFruits);

  const [message, setMessage] = useState("");
  const [selectedLetter, setSelectedImage] = useState(1); // default image 1

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Handle continue button
  const handleContinue = () => {
    if (message.trim() === "") {
      alert("Vui lòng nhập lời nhắn trước khi tiếp tục!");
      return;
    }

    navigate("/finish-giftbox", {
      state: { message, selectedLetter, selectedBox, selectedFruits },
    });
  };

  // Handle number button click
  const handleImageChange = (num: number) => {
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

          {/* === Number buttons === */}
          <div className="number-button-group">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                className={`number-btn ${selectedLetter === num ? "active" : ""}`}
                onClick={() => handleImageChange(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="letter-suggest-btn d-btn d-btn-font"
              onClick={handleContinue}
            >
              <span>Gợi ý thư</span>
            </button>
          </div>    
        </div>

        {/* RIGHT SIDE */}
        <div className="fruit-selection-right">
          <div className="letter-display-area">
            <img
              src={letters[selectedLetter]}
              alt={`Letter Style ${selectedLetter}`}
              className="letter-preview-image"
            />
            <button
              className="letter-continue-btn d-btn d-btn-font"
              onClick={handleContinue}
            >
              <span>Tiếp tục</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}