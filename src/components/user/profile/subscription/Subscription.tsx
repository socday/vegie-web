import React from 'react';
import "./styles/Subscription.css";


export default function Subscription() {
    return (
        <div className="orders">
            <div className="profile-subscription">
                <div className = "profile-subscription-left">
                    <div className= "ps-image">

                    </div>
                    <input type="text" placeholder="Gói mua tuần"  />                    


                </div>
                <div className = "profile-subscription-right">
                    <div className="form-fields">
                            <input type="text" placeholder="Ngày bắt đầu: dd/mm/yy"  />
                            <input type="text" placeholder="Ngày kết thúc: dd/mm/yy"  />
                            <input type="text" placeholder="Chu kỳ thanh toán: dd/mm/yy"  />
                    </div>    
                </div>
            </div>

            <div className="profile-form-actions">
                <button className="d-btn d-btn-font"><span>Hủy</span></button>
                <button className="d-btn d-btn-font"><span>Gia hạn ngay</span></button>
            </div>
        </div>
    )
}