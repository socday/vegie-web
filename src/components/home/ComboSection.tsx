import { useNavigate } from "react-router-dom";
import "./styles/ComboSection.css";

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
          {/* First card */}
          <div
            className="combo-package-card-1"
            onClick={() => navigate("/weekly-package")}
            style={{ cursor: "pointer" }}
          >
            <div className="package-front">
              <div className="package-title">
                <span className="package-line">Gói</span>
                <span className="package-line">mua lẻ</span>
              </div>
            </div>
            <div className="package-back">
              <div className="package-title">
                <span className="package-line">Ăn</span>
                <span className="package-line">An Lành</span>
              </div>
              <div className="package-description">
                Quà Tươi Xanh - Nấu Nhanh Ăn Lành
              </div>
            </div>
          </div>

          {/* Second card */}
          <div
            className="combo-package-card"
            onClick={() => navigate("/monthly-package")}
            style={{ cursor: "pointer" }}
          >
            <div className="package-front">
              <div className="package-title">
                <span className="package-line-1">Gói</span>
                <span className="package-line-2">theo tuần</span>
              </div>
            </div>
            <div className="package-back">
              <div className="package-title">
                <span className="package-line-1">Tuần</span>
                <span className="package-line-2">An Nhàn</span>
              </div>
              <div className="package-description">
                An tâm trọn tuần - An nhàn trọn vẹn
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
