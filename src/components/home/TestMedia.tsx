import React, { useState, useRef, useLayoutEffect } from "react";
import "./styles/ViewComboSection.css";
import { useMediaQuery } from "react-responsive";

export default function TestMedia() {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const [showRight, setShowRight] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [translateX, setTranslateX] = useState(0);

  // Button position offset: -32px outside the card
  const rightEdgeOffset = -32;

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

  return (
    <div className="view-combo-single">
      <div
        className={`view-combo-single-card ${showRight ? "show-right" : ""}`}
        ref={cardRef}
      >
        {/* ===== Desktop Layout ===== */}
        {isDesktop && (
          <>
            <div className="view-combo-single-left">
              <h1>Gói mua lẻ</h1>
              <h2>Ăn An Lành</h2>
              <p className="subtitle">
                <strong>Thức Quà Tươi Xanh - Nấu Nhanh Ăn Lành</strong>
              </p>
              <p>
                Mang thực phẩm tươi ngon, lành mạnh về nhà chưa bao giờ dễ dàng
                hơn. Bạn muốn toàn quyền quyết định thực đơn mỗi ngày?
              </p>
            </div>

            <div className="divider" />

            <div className="view-combo-single-right">
              <p className="section-title">
                <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
              </p>
              <ul>
                <li>Cung cấp từ 5 - 6 loại rau củ quả.</li>
                <li>Phù hợp với khẩu phần ăn ít người từ 3 người đổ lại</li>
                <li>Đảm bảo đầy đủ dinh dưỡng</li>
                <li>Rau hàng tận vườn, từ nhà vườn</li>
              </ul>
              <p className="section-title">
                <strong>Tiện ích:</strong>
              </p>
              <ul>
                <li>Giao hàng tận nơi</li>
                <li>Được cung cấp thực đơn AI</li>
                <li>
                  Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ
                  quả
                </li>
              </ul>
            </div>
          </>
        )}

        {/* ===== Mobile Layout ===== */}
        {isMobile && (
          <>
            <div className="mobile-panel left">
              <div className="panel-inner">
                <h1>Gói mua lẻ</h1>
                <h2>Ăn An Lành</h2>
                <p className="subtitle">
                  <strong>Thức Quà Tươi Xanh - Nấu Nhanh Ăn Lành</strong>
                </p>
                <p>
                  Mang thực phẩm tươi ngon, lành mạnh về nhà chưa bao giờ dễ dàng
                  hơn.
                  <br />
                  Bạn muốn toàn quyền quyết định thực đơn mỗi ngày?
                </p>
              </div>
            </div>

            <div className="mobile-panel right">
              <div className="panel-inner">
                <p className="section-title">
                  <strong>ĂN AN LÀNH (Mua lẻ tự chọn)</strong>
                </p>
                <ul>
                  <li>Cung cấp từ 5 - 6 loại rau củ quả.</li>
                  <li>Phù hợp với khẩu phần ăn ít người từ 3 người đổ lại</li>
                  <li>Đảm bảo đầy đủ dinh dưỡng</li>
                  <li>Rau hàng tận vườn, từ nhà vườn</li>
                </ul>
                <p className="section-title">
                  <strong>Tiện ích:</strong>
                </p>
                <ul>
                  <li>Giao hàng tận nơi</li>
                  <li>Được cung cấp thực đơn AI</li>
                  <li>
                    Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ
                    quả
                  </li>
                </ul>
              </div>
            </div>

            <button
              ref={btnRef}
              className={`mobile-toggle-button ${showRight ? "right" : "left"}`}
              onClick={() => setShowRight(!showRight)}
              aria-label={showRight ? "Show left content" : "Show right content"}
              style={{
                transform: showRight
                  ? `translateX(${translateX}px)`
                  : "translateX(0)",
              }}
            >
              <span className="arrow">{showRight ? "<" : ">"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
