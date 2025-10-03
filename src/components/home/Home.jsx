import React, { useState } from 'react';

import mascotImage from '../../assets/mascot.png';
import brandLogo from '../../assets/logo-brand.png';
import { useNavigate } from 'react-router-dom';
import '../../css/Home.css';
import ComboSection from './ComboSection';


// Dữ liệu vẫn giữ nguyên, rất tiện lợi
const tabsData = [
  {
    id: 'tam-nhin',
    title: 'TẦM NHÌN',
    content: 'Chúng tôi không chỉ là một nền tảng bán rau củ quả. Chúng tôi là người bạn đồng hành, là cánh tay phải giúp bạn có được những bữa ăn xanh, lành và đủ đầy, mà không cần mất quá nhiều thời gian hay suy nghĩ.'
  },
  {
    id: 'su-menh',
    title: 'SỨ MỆNH',
    content: (
      <>
        VEGGIE CARE project luôn hướng đến việc trở thành 
        <strong> "nhà buôn hiện đại" - người bạn đồng hành tin cậy</strong>
        , giúp thế hệ trẻ việt nam dễ dàng tiếp cận với nguồn thực phẩm chất lượng, đồng thời xây dựng một lối sống xanh, tiện lợi và thông minh hơn, mang rau củ sạch, tươi ngon đến từng hộ gia đình hiện đại, giúp mọi người ăn uống lành mạnh hơn, sống khỏe mạnh hơn - mà không phải đánh đổi sự tiện lợi, thời gian hay trải nghiệm.
      </>
    )
  },
  {
    id: 'gia-tri',
    title: 'GIÁ TRỊ CỐT LÕI',
    content: 'Tại vegie care, chúng tôi mong muốn mang lại từng giá trị hương vị trong từng loại rau củ quả. chính vì vậy, chúng tôi xây dựng dịch vụ dựa trên 5 giá trị cốt lõi: sự tiện lợi thông minh - cung cấp đầy đủ dưỡng chất - sự tươi mới kết hợp với yếu tố truyền thống - cá nhân hoá trải nghiệm - sự chân thành và minh bạch là yếu tố cốt lõi vegie tận tụy trong từng sản phẩm trước khi được giao tận tay bạn.'
  }
];
const boxesData = [
  { id: 1, number: '01', title: 'Blind Box', description: 'Mô tả sản phẩm' },
  { id: 2, number: '02', title: 'Gift Box', description: 'Mô tả sản phẩm' },
  { id: 3, number: '03', title: 'Detox Box', description: 'Mô tả sản phẩm' }
];

export default function Home() {
  const navigate = useNavigate(); // <-- đây là chỗ thiếu
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);

  // State ban đầu thành `null` để không có tab nào mở
  const [openTabId, setOpenTabId] = useState(null);

  // Tạo một hàm xử lý click để logic phức tạp hơn
  const handleToggleTab = (tabId) => {
    // Nếu click vào tab đang mở, hãy đóng nó lại (set về null)
    if (openTabId === tabId) {
      setOpenTabId(null);
    } else {
      // Nếu click vào tab khác, hãy mở nó ra
      setOpenTabId(tabId);
    }
  };

  return (
    <>
      <div className="home-page-container">
        <section className='mascot-section'>
            <img
            src={mascotImage}
            alt="Linh vật Veggie Care"
            className="mascot-image"
            />
        </section>
      
        <section className='intro-section'>
            <div className="intro-container">
                <div className="intro-brand">
                  <h1 className="head1">
                    Vegie
                    Care</h1>
                </div>

               <div className="intro-actions">
                {tabsData.map((tab) => (
                  <div key={tab.id} className="tab-item-container">
                    <button className="action-button">{tab.title}</button>
                    <div className="content-bubble">{tab.content}</div>
                  </div>
                ))}
              </div> 
            </div>
        </section>
        <div className="divider"></div>
        <section className='ai-menu-section'>
            <div className="ai-menu-container">
                <div className={`ai-menu-wrapper ${isAiMenuOpen ? 'open' : ''}`}
                    onMouseEnter={() => setIsAiMenuOpen(true)}
                    onMouseLeave={() => setIsAiMenuOpen(false)}
                    onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}>
                  {/* Nội dung ban đầu (chữ AI Menu) */}
                  <div className="ai-menu-initial-content">
                      <span className="ai-menu-text-top">AI</span>
                      <span className="ai-menu-text-bottom">Menu</span>
                  </div>

                  {/* Nội dung khi mở rộng */}
                  <div className="ai-menu-expanded-content">
                      <h2 className="ai-menu-title">Khám Phá AI Menu</h2>
                      <p className="ai-menu-description">
                          Bạn là fan của món luộc thanh đạm, hay team mê món xào đậm đà? Chỉ cần vài bước khai báo nhanh (hoặc liên kết tài khoản với hành vi mua sắm), Vegie AI sẽ ghi nhớ “gu ăn” của bạn để gợi ý món phù hợp.
                      </p>
                      <button className="ai-menu-details-button">Xem chi tiết</button>
                  </div>
                </div>
            </div>
        </section>
        
        <ComboSection />
        <section className="box-section">
          <div className="box-section-container">
            {/* Tiêu đề cho section (tùy chọn) */}
            <h2 className="section-title">Các Sản Phẩm Của Vegie</h2>

            {/* Lưới chứa các card */}
            <div className="box-grid">
              {boxesData.map((box) => (
                <div key={box.id} className="product-box-card">
                  <div className="box-number">{box.number}</div>
                  <div className="box-content">
                    <h3 className="box-title">{box.title}</h3>
                    <p className="box-description">{box.description}</p>
                    <button className="box-details-button">Xem chi tiết</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="voucher-section">
          <div className="voucher-container">
            {/* Cột bên trái (40%) */}
            <div className="voucher-info">
              <h2 className="voucher-title">
                Các Ưu Đãi Trong Tuần <br />
                Giành Cho Bạn
              </h2>
              <ul className="voucher-list">
                <li>Miễn phí vận chuyển cho đơn hàng đầu tiên</li>
                <li>Miễn phí ship nội thành với đơn hàng đặt trước 17h mỗi ngày</li>
                <li>Miễn phí vận chuyển cả tuần khi mua gói theo tuần</li>
              </ul>
            </div>

            {/* Cột bên phải (60%) */}
           
          </div>
        </section>
      </div>
    </>
  );
}