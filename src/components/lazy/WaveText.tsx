// WaveText.tsx
import React from "react";
import "./WaveText.css"; // paste the CSS below into this file

type WaveTextProps = {
  text?: string;
  speed?: number;        // total animation duration in seconds (default 1.2)
  amplitude?: number;    // translateY in px (default 8)
  gap?: number;          // stagger gap in seconds between letters (default 0.06)
};

export default function WaveText({
  text = "Đang kiểm tra đăng nhập...",
  speed = 1.2,
  amplitude = 8,
  gap = 0.06,
}: WaveTextProps) {
  // Keep whitespace (so spaces are preserved)
  const chars = Array.from(text);

  return (
    <div className="wave-text-container">
    <span className="wave-text" aria-live="polite" role="status">
      {chars.map((ch, i) => {
        // For space, render a non-breaking space so spacing preserves
        const displayChar = ch === " " ? "\u00A0" : ch;
        const delay = `${(i * gap).toFixed(3)}s`;
        const style: React.CSSProperties = {
          animationDelay: delay,
          // pass CSS variables so amplitude/speed can be dynamic
          // note: these are read in CSS by var() fallback
          ["--wave-duration" as any]: `${speed}s`,
          ["--wave-amplitude" as any]: `${amplitude}px`,
        };
        return (
          <span
            key={i}
            className="wave-char"
            style={style}
            aria-hidden={ch === "." ? "true" : undefined}
          >
            {displayChar}
          </span>
        );
      })}
      {/* optional: make the trailing dots pulse as well via CSS by default */}
    </span>
    </div>
  );
}