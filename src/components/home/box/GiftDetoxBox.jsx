import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/GiftDetoxBox.css";

export default function GiftDetoxBox() {
  const navigate = useNavigate();

  const handleGiftBoxClick = () => {
    navigate('/box-3d');
  };

  return (
    <>  
    <div className="button-container">

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
          Trọn Vị Ăn
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

      <br />
      <br />
      <br />

      <button className="detox-btn">
        <span
          className="large-text"
          style={{ color: "#27600B" }}
        >
          Detox Box
        </span>
         <span className="small-text"
          style={{  color: "#27600B",  }}
        >
          Đang trong giai đoạn hoàn thiện. Vui lòng quay lại sau nhé!
        </span>
        {/* <div className="inner-button">Xem Chi Tiết</div> */}
      </button>

      <br />
      <br />
      <br /><br />
      <br />
      <br />      
    </div>
    </>
  );
}