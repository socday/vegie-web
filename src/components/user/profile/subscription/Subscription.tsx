import React, { use } from 'react';
import "./styles/Subscription.css";
import { useMediaQuery } from 'react-responsive';
import { is } from '@react-three/fiber/dist/declarations/src/core/utils';


export default function Subscription() {

    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });
    return (
        <div className="orders">
            <div className="profile-subscription">
                {isDesktop &&
                <>
                <div className = "profile-subscription-left">
                    <div className= "ps-image">
                    </div>
                    <input type="text" placeholder="Gói mua tuần"   />                    
                </div>
                </>}
                <div className = "profile-subscription-right">


                {isMobile && <>

                    <span className='p-w-package'>Gói mua tuần</span>
                    <div className= "ps-image">
                    </div>
                    </>}
                    
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