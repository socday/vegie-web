import React from "react";
import "./styles/PersonalHealth.css";
export default function PersonalHealth() {

    return (
        <div className="orders">
            <div className="profile-personal-health-form">
                <h2>Phiếu sức khỏe</h2>
            
                <div className="form-fields">
                    <input type="text" placeholder="Mong muốn"  />
                    <input type="text" placeholder="Dị ứng"  />
                    <input type="text" placeholder="Sở thích"  />
                    <input type="text" placeholder="Tình trạng sức khỏe"  />
                </div>    

                <div className="profile-form-actions">
                    <button className="d-btn d-btn-font"><span>Lưu</span></button>
                    <button className="d-btn d-btn-font"><span>Hủy</span></button>
                </div>
            </div>
        </div>
    )
}