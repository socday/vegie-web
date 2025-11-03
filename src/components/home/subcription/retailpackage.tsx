import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/RetailPackage.css";
import { useMediaQuery } from "react-responsive";

export default function RetailPackage() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const [showRight, setShowRight] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [translateX, setTranslateX] = useState(0);

  // === Button position offset: -32px outside the card ===
  const rightEdgeOffset = -54;

  const computeTranslate = () => {
    const card = cardRef.current;
    const btn = btnRef.current;
    if (!card || !btn) return;
    const cardRect = card.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const desiredLeft = cardRect.right + rightEdgeOffset - btnRect.width;
    const currentLeft = btnRect.left;
    const delta = Math.round(desiredLeft - currentLeft);
    setTranslateX(delta);
  };

  useLayoutEffect(() => {
    computeTranslate();
    window.addEventListener("resize", computeTranslate);
    return () => window.removeEventListener("resize", computeTranslate);
  }, [showRight]);

  const navigate = useNavigate();

  // === Form state ===
  const [allergy, setAllergy] = useState<string>("");
  const [feeling, setFeeling] = useState<string>("");

  // === Static product info ===
  const blindBoxId = "ca108cad-a026-4dea-b3d1-62f7fcc51ef9";
  const quantity = 1;
  const price = 150000;

  // === Handle submit ===
  const handleThanhToan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/thanh-toan", {
      state: {
        from: "retail-package",
        allergy,
        feeling,
        blindBoxId,
        quantity,
        price,
      },
    });
  };

  // === Render ===
  return (
  <div className="retail-package">
      {/* ===== Desktop layout ===== */}
      {isDesktop && (
        <div className="retail-form-section" ref={cardRef}>
          <div className="retail-form-left">
            <h2>Gói mua lẻ</h2>
            <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
            <ul>
              <li>
                Cung cấp từ 5 - 6 loại rau củ quả. Phù hợp với khẩu phần ăn ít
                người từ 3 người trở lại
              </li>
              <li>Đảm bảo đầy đủ dinh dưỡng</li>
              <li>Rau hàng tận vườn, từ nhà vườn</li>
            </ul>
          </div>

          <div className="retail-form-divider" />

          <form className="retail-form-right" onSubmit={handleThanhToan}>
            <h3>Phiếu sức khỏe</h3>
            <input
              type="text"
              name="allergy"
              placeholder="Dị ứng*"
              value={allergy}
              onChange={(e) => setAllergy(e.target.value)}
              required
            />
            <input
              type="text"
              name="feeling"
              placeholder="Hôm nay bạn cảm thấy như thế nào?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />

            <button type="submit" className="d-btn d-btn-font pay-btn">
              <span>Thanh toán</span>
            </button>
          </form>
        </div>
      )}

      {/* ===== Mobile layout (optional slide) ===== */}
      {isMobile && (
        <div ref={cardRef} className={`retail-mobile-form ${showRight ? "retail-show-right" : ""}`}>
          <div className="retail-mobile-panel retail-left">
            <div className="retail-panel-inner">
              <h2>Gói mua lẻ</h2>
              <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
              <ul>
                <li>
                  Cung cấp từ 5 - 6 loại rau củ quả 
                  <li>Phù hợp với khẩu phần ăn ít người từ 3 người trở lại</li>
                </li>
                  <li>Đảm bảo đầy đủ dinh dưỡng</li>
                <li>Rau hàng tận vườn, từ nhà vườn</li>
              </ul>
            </div>
          </div>

          <div className="retail-mobile-panel retail-right">
            <form className="retail-panel-inner frp" onSubmit={handleThanhToan}>
              <h2>Phiếu sức khỏe</h2>
              <input
                type="text"
                name="allergy"
                placeholder="Dị ứng*"
                value={allergy}
                onChange={(e) => setAllergy(e.target.value)}
                required
              />
              <input
                type="text"
                name="feeling"
                placeholder="Hôm nay bạn cảm thấy như thế nào?"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
              />
              <button type="submit" className="d-btn d-btn-font pay-btn retail-pay-btn">
                <span>Thanh toán</span>
              </button>
            </form>
          </div>

          <button
            ref={btnRef}
            className={`retail-mobile-toggle-button ${showRight ? "retail-right" : "retail-left"}`}
            onClick={() => setShowRight(!showRight)}
            aria-label={showRight ? "Show left content" : "Show right content"}
            style={{
              transform: showRight
                ? `translateX(${translateX}px)`
                : "translateX(0)",
            }}
          >
            <span className="retail-arrow">{showRight ? "<" : ">"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
