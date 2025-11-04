import React, { useLayoutEffect, useRef, useState } from "react";
import "../../../css/WeeklyPackage.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

export default function WeeklyPackage() {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isDesktop = useMediaQuery({ minWidth: 768 });

    const [showRight, setShowRight] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const [translateX, setTranslateX] = useState(0);

    // === Button position offset: -32px outside the card ===
  const rightEdgeOffset = 48;

    const computeTranslateW = () => {
      const card = cardRef.current;
      const btn = btnRef.current;
      if (!card || !btn) return;
      const cardRect = card.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      // debug: log measurements to help diagnose timing/layout issues
      // (prefix so logs are identifiable when both components are mounted)
      // eslint-disable-next-line no-console
      console.debug("[Weekly] computeTranslate:", { cardRect, btnRect });
      const desiredLeft = cardRect.right + rightEdgeOffset - btnRect.width;
      const currentLeft = btnRect.left;
      const delta = Math.round(desiredLeft - currentLeft);
      // eslint-disable-next-line no-console
      console.debug("[Weekly] desiredLeft, currentLeft, delta:", desiredLeft, currentLeft, delta);
      setTranslateX(delta);
    };

    useLayoutEffect(() => {
      computeTranslateW();
      window.addEventListener("resize", computeTranslateW);
      return () => window.removeEventListener("resize", computeTranslateW);
    }, [showRight]);

    const navigate = useNavigate();

    // Form state
    const [allergy, setAllergy] = useState<string>("");
    const [feeling, setFeeling] = useState<string>("");
  
    // Static item info
    const blindBoxId = "ca108cad-a026-4dea-b3d1-62f7fcc51ef9";
    const quantity = 2;
    const price = 300000;

    const handleThanhToan = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      navigate("/thanh-toan", {
        state: {
          from: "weekly-package",
          allergy,
          feeling,
          blindBoxId,
          quantity,
          price,
        },
      });
    }
  // Render: mirror retail package structure (wrap with root div and align mobile heading)
  return (
    <div className="weekly-package">
      {isDesktop && (
        <section className="weekly-main-section container" ref={cardRef}>
          <article className="weekly-package">
            <h2>Gói theo tuần</h2>
            <p className="weekly-subheading">TUẦN AN NHÀN (Mua lẻ theo tuần)</p>
            <ul>
              <li>Giá ưu đãi hơn</li>
              <li>
                Bao gồm 2 box được gieo 2 lần trong tuần tươi ngon hơn (hoặc có thể
                điều chỉnh theo mong muốn)
              </li>
              <li>Cung cấp 7-8 loại rau củ quả</li>
              <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
            </ul>
            <button className="weekly-fancy-btn">300,000đ</button>
          </article>

          <div className="weekly-form-divider" />

          <article className="weekly-health-voucher">
            <h2>Phiếu sức khỏe</h2>
            <form onSubmit={handleThanhToan}>
              <label>
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
              </label>
              <button type="submit" className="d-btn d-btn-font weekly-pay-btn">
                <span>Thanh toán</span>
              </button>
            </form>
          </article>
        </section>
      )}

      {isMobile && (
        <div ref={cardRef} className={`weekly-mobile-form ${showRight ? "weekly-show-right" : ""}`}>
          <div className="weekly-mobile-panel weekly-left">
            <div className="weekly-panel-inner">
              <h2>Gói theo tuần</h2>
              <p className="weekly-subheading">TUẦN AN NHÀN (Mua lẻ theo tuần)</p>
              <ul>
                <li>Giá ưu đãi hơn</li>
                <li>
                  Bao gồm 2 box được gieo 2 lần trong tuần tươi ngon hơn (hoặc có thể
                  điều chỉnh theo mong muốn)
                </li>
                <li>Cung cấp 7-8 loại rau củ quả</li>
                <li>Phù hợp cho gia đình với từ 4 người trở lên</li>
              </ul>
              {/* <button className="weekly-fancy-btn">Giá tiền</button> */}
            </div>
          </div>

          <div className="weekly-mobile-panel weekly-right">
            <form className="weekly-panel-inner" onSubmit={handleThanhToan}>
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
              <button type="submit" className="d-btn d-btn-font weekly-pay-btn">
                <span>Thanh toán</span>
              </button>
            </form>
          </div>

          <button
            ref={btnRef}
            className={`weekly-mobile-toggle-button ${showRight ? "weekly-right" : "weekly-left"}`}
            onClick={() => {
              // toggle the panel
              setShowRight((s) => !s);
              // measure/compute the needed translate after the DOM has updated
              // requestAnimationFrame ensures we measure after layout/paint; a short
              // setTimeout acts as a fallback for delayed layout (fonts, images).
              requestAnimationFrame(() => {
                computeTranslateW();
                setTimeout(() => computeTranslateW(), 50);
              });
            }}
            aria-label={showRight ? "Show left content" : "Show right content"}
            style={{
              transform: showRight
                ? `translateX(${translateX}px)`
                : "translateX(0)",
            }}
          >
            <span className="weekly-arrow">{showRight ? "<" : ">"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
