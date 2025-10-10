import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GiftDetoxBox.css";

export default function GiftDetoxBox() {
  const navigate = useNavigate();



  return (
    <>  
    <div className="button-container">



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