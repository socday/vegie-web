import { useNavigate } from "react-router-dom";
import "./styles/ComboSection.css";
type PackageCardProps = {
  defaultLine1: string;
  defaultLine2: string;
  hoverLine1: string;
  hoverLine2: string;
  hoverDescription: string;
  onClick?: () => void; // ✅ optional click handler
};

function PackageCard({
  defaultLine1,
  defaultLine2,
  hoverLine1,
  hoverLine2,
  hoverDescription,
  onClick,
}: PackageCardProps) {
  return (
    <div className="package-card" onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Default content */}
      <div className="package-front">
        <div className="package-title">
          <span className="package-line-1">{defaultLine1}</span>
          <span className="package-line-2">{defaultLine2}</span>
        </div>
      </div>

      {/* Hover content */}
      <div className="package-back">
        <div className="package-title">
          <span className="package-line-1">{hoverLine1}</span>
          <span className="package-line-2">{hoverLine2}</span>
        </div>
        <p className="package-description">{hoverDescription}</p>
      </div>
    </div>
  );
}


export default function ComboSection() {
  const navigate = useNavigate();

  return (
    <section className="combo-section">
      <div className="combo-container">
        <div className="combo-title">
          <span className="combo-title-top">Gói</span>
          <span className="combo-title-bottom">dịch vụ</span>
        </div>

        <div className="combo-packages">
          <PackageCard
            defaultLine1="Gói"
            defaultLine2="mua lẻ"
            hoverLine1="Ăn"
            hoverLine2="An Lành"
            hoverDescription="Quà Tươi Xanh - Nấu Nhanh Ăn Lành"
            onClick={() => navigate("/weekly-package")} // ✅ now works
          />

          <PackageCard
            defaultLine1="Gói"
            defaultLine2="theo tuần"
            hoverLine1="Tuần"
            hoverLine2="An Nhàn"
            hoverDescription="An tâm trọn tuần - An nhàn trọn vẹn"
            onClick={() => navigate("/monthly-package")} // ✅ example
          />
        </div>
      </div>
    </section>
  );
}
