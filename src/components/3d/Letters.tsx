import React, { use, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/FruitSelection.css";
import "./styles/letters.css";

// Import all images statically
import letter1 from "../../assets/images/webp/letter1.webp";
import letter2 from "../../assets/images/webp/letter2.webp";
import letter3 from "../../assets/images/webp/letter3.webp";
import { getAiLetterSuggestion } from "../../router/boxApi";
import { useMediaQuery } from "react-responsive";

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
  const [isMobileLetter, setIsMobileLetter] = useState(false);
  const [selectedLetter, setSelectedImage] = useState(1);
  const [message, setMessage] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });
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

  const isMessageEmpty = message.trim() === "";
  const handleMessageContinue = () => {
    if (isMessageEmpty) {
      alert("Vui lòng nhập lời nhắn trước khi tiếp tục!");
      return;
    }
    setIsMobileLetter(!isMobileLetter);
  }
  // === continue ===
  const handleContinue = () => {
    if (isMessageEmpty) {
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
        <div className={`fruit-selection-left letters-left ${isMobileLetter ? "mobile-letter-active" : ""}`}>
          <div className="fruit-selection-title-display letter-title-display">
            <h1 className="gift-box-title letter-title">
              {isAiLetter ? "AI" : ""} Letter
            </h1>
            <div className="title-line"></div>
          </div>

          <div className="instructions-letters">
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
            {isMobile && <>
              <button className="d-btn d-btn-font mobile-continue-btn"
                onClick = { () => {
                  handleMessageContinue()
                }}>
                <span>Tiếp tục</span>
              </button>
            </>}
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

        {isMobileLetter && <>
        <div className="mobile-letter-top-bar">
          <div className="fruit-selection-title-display letter-title-display">
            <h1 className="gift-box-title letter-title">
              Letter
            </h1>
            <div className="title-line"></div>
          </div>
          <div className="lazy">
            <div className="instructions-letters">
                  <p>Chọn 1 mẫu thư nhé</p>
            </div>
            <div className="number-button-group">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`number-btn ${selectedLetter === num ? "active" : ""} ${isMobileLetter &&  "number-btn-active"}`}
                  onClick={() => handleImageChange(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
        </>}
        {/* RIGHT SIDE */}
        <div className={`fruit-selection-right letters-right ${!isMobileLetter ? "mobile-letter-active" : ""}`}>
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
