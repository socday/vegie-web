import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";

// Import all images statically
import letter1 from "../../assets/images/letter1.png";
import letter2 from "../../assets/images/letter2.png";
import letter3 from "../../assets/images/letter3.png";
import { getAiLetterSuggestion } from "../../router/boxApi";

// Lookup object
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
  const [isAiLetter, setIsAiLetter] = useState(false);
  const [selectedLetter, setSelectedImage] = useState(1);
  const [message, setMessage] = useState("");

  // --- AI prompt fields ---
  const [receiver, setReceiver] = useState("");
  const [occasion, setOccasion] = useState("");
  const [mainWish, setMainWish] = useState("");

  const selectedBox = location.state?.selectedBox || 1;
  const selectedFruits = location.state?.selectedFruits;

  console.log("Selected fruits:", selectedFruits);

  // === handle input text changes ===
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // === handle AI letter generation ===
  const handleCreateWish = async () => {
    if (!receiver || !occasion || !mainWish) {
      alert("Vui lòng điền đầy đủ thông tin để AI tạo lời chúc!");
      return;
    }
    setMessage("Đang tạo lời chúc... Vui lòng chờ trong giây lát.");

    try {
      const res = await getAiLetterSuggestion(receiver, mainWish, occasion);
      console.log("AI Letter Response:", res);
      if (res.wish) {
        // paste AI-generated text into textarea
        setMessage(res.wish);
        // setMessage(res.data.generatedText || res.data || "Không có nội dung được tạo.");
      } else {
        alert("Không thể tạo thư AI. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("AI Letter Error:", error);
      alert("Đã xảy ra lỗi khi tạo thư AI.");
    }
  };

  // === continue ===
  const handleContinue = () => {
    if (message.trim() === "") {
      alert("Vui lòng nhập lời nhắn trước khi tiếp tục!");
      return;
    }

    navigate("/finish-giftbox", {
      state: { message, selectedLetter, selectedBox, selectedFruits },
    });
  };

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
              {isAiLetter ? "AI" : ""} Letter
            </h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions">
            {isAiLetter ? (
              <>
                <p>Bạn không giỏi viết thư ?</p>
                <p>Đừng lo, Vegie đã có AI Letter rồi đây!</p>
                <p>Hãy nhập những mục bên dưới để AI Letter giúp bạn nhé</p>
              </>
            ) : (
              <>
                <p>Một lá thư nhỏ xinh trong gift box – món quà bất ngờ</p>
                <p>để người thân yêu của bạn biết rằng họ luôn được trân trọng.</p>
              </>
            )}
          </div>

          {isAiLetter && (
            <div className="ai-letter-prompts">
              <label>
                <input
                  type="text"
                  className="d-btn-font d-btn p1"
                  placeholder="Người nhận là ai?"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </label>

              <label>
                <input
                  type="text"
                  className="d-btn-font d-btn p2"
                  placeholder="Nhân dịp gì vậy?"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  required
                />
              </label>

              <label>
                <input
                  className="d-btn-font d-btn p3"
                  placeholder="Bạn muốn nói gì trong thư?"
                  value={mainWish}
                  onChange={(e) => setMainWish(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          <div className="letter-input-container">
            <textarea
              className="letter-input"
              placeholder="Hãy viết lời nhắn tại đây!"
              value={message}
              onChange={handleChange}
              required
            />
          </div>

          {/* Buttons */}
          <div className="number-button-group">
            {!isAiLetter ? (
              [1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`number-btn ${selectedLetter === num ? "active" : ""}`}
                  onClick={() => handleImageChange(num)}
                >
                  {num}
                </button>
              ))
            ) : (
              <button className="d-btn d-btn-font" onClick={handleCreateWish}>
                <span>Tạo lời chúc</span>
              </button>
            )}

            <button
              className={`${isAiLetter ? "ai-letter-active" : ""} letter-suggest-btn d-btn d-btn-font`}
              onClick={() => setIsAiLetter(!isAiLetter)}
            >
              <span>{isAiLetter ? "Quay lại" : "Gợi ý thư"}</span>
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
            <div className="ai-letter-actions">
              <div className="number-button-group">
                {isAiLetter &&
                  [1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`number-btn ${selectedLetter === num ? "active" : ""}`}
                      onClick={() => handleImageChange(num)}
                    >
                      {num}
                    </button>
                  ))}
              </div>

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
    </div>
  );
}