import React from "react";
import "../styles/BoxSelector.css";
import { useNavigate } from "react-router-dom";
export default function BoxSelector() {
      const navigate = useNavigate();
    const handleGiftBoxClick = () => {
    navigate('/fruit-selection');
  };

  return (
    <>
    <div className="button-container">
      <button className="blindbox-btn" onClick={() => navigate("/blind-box")}>
        <span
          className="large-text"
          style={{ color: "#27600B" }}
        >
          Blind Box
        </span>
        <span className="middle-text" style={{ color: "#27600B" }}>
          Món Tròn Ngẫu Nhiên
        </span>
        <span
            className="small-text"
          style={{
            color: "#27600B",
          }}
        >
          Giao hàng tận nơi
        </span>
        <span 
            className="small-text"
          style={{
            color: "#27600B",
          }}
        >
          Được cung cấp thực đơn AI <br/>Chat với bé cừu AI dinh dưỡng về các thông tin thực phẩm rau củ quả
        </span>
      </button>
      <button className="giftbox-btn" onClick={handleGiftBoxClick}>
        <span
          className="large-text"
          style={{  color: "white" }}
        >
          Gift Box
        </span>
        <span
        className="middle-text"
          style={{  color: "white" }}
        >
          Trọn Vị An
        </span>
        <span className="small-text"
          style={{ color: "white",}}
        >
          Định lượng 5kg - Order trc 2-3 ngày
        </span>
        <span className="small-text"
          style={{ color: "white",  }}
        >
          Được tuỳ ý lựa chọn dựa trên những sản phẩm có sẵn (tối đa 5 loại)
        </span>
        <span className="small-text"
          style={{ color: "white",  }}
        >
          Được đóng gói thùng deco sạch sẽ đảm bảo tính trang trọng
        </span>
        <span className="small-text"
          style={{  color: "white",  }}
        >
          Quà cá nhân hoá được tự ý thiết kế theo dạng 3D
        </span>
      </button>
      </div>
    </>
  );
}
