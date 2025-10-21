import React, { useState } from 'react';

import mascotSmile from '../../assets/images/mascot-smile.png';
import brandLogo from '../../assets/logo-brand.png';
import vegeBefore from '../../assets/images/Homepage/VegeBefore.png';
import vegeAfter from '../../assets/images/Homepage/VegeAfter.png';
import stars from '../../assets/images/Homepage/Stars.png';
import sheep from '../../assets/images/Homepage/Sheep.png';
import mouthBefore from '../../assets/images/Homepage/MouthBefore.png';
import mouthAfter from '../../assets/images/Homepage/MouthAfter.png';
import rightFoot from '../../assets/images/Homepage/RightFoot.png';
import rightHand from '../../assets/images/Homepage/RightHand.png';
import monTronBack from '../../assets/images/Homepage/MonTronNgauNhienBack.png';
import monTronFront from '../../assets/images/Homepage/MonTronNgauNhienFront.png';
import tronViAnBack from '../../assets/images/Homepage/TronViAnBack.png';
import tronViAnFront from '../../assets/images/Homepage/TronViAnFront.png';
import mascot1 from '../../assets/mascot1.png';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import ComboSection from './ComboSection';
import { useMediaQuery } from 'react-responsive';


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
  { id: 1, number: '01', title: 'Món Tròn Ngẫu Nhiên', description: 'Bất ngờ lành mạnh đang chờ bạn khám phá mỗi tuần!' },
  { id: 2, number: '02', title: 'Trọn Vị An', description: 'Rau củ tùy duyên - Ưu phiền tan biến' }
];

export default function Home() {
  const navigate = useNavigate();
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 769px)' });

  return (
    <>
      {/* SVG Filter cho noise effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="noise-filter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="4" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="3" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
          <filter id="noise-border">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.05" 
              numOctaves="2" 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div className='normal-spacing'></div> 
      <div className="home-page-container">
        <section className='hero-section'>
          {isDesktop && 
          <>
          <div 
            className={`hero-wrapper ${isHeroHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHeroHovered(true)}
            onMouseLeave={() => setIsHeroHovered(false)}
          >
            <img
              src={vegeBefore}
              alt="Vegie Before"
              className="hero-image hero-image-before"
            />
            <img
              src={vegeAfter}
              alt="Vegie After"
              className="hero-image hero-image-after"
            />
            <img
              src={stars}
              alt="Stars"
              className="hero-image hero-image-stars"
            />
            
            <div className="sheep-overlay-group">
              <img
                src={mouthBefore}
                alt="Mouth Before"
                className="mouth-image mouth-before"
              />
              <img
                src={mouthAfter}
                alt="Mouth After"
                className="mouth-image mouth-after"
              />
              <img
                src={sheep}
                alt="Sheep"
                className="sheep-image"
              />
              <img
                src={rightFoot}
                alt="Right Foot"
                className="sheep-accessory sheep-foot"
              />
              <img
                src={rightHand}
                alt="Right Hand"
                className="sheep-accessory sheep-hand"
              />
              <img
                src={rightFoot}
                alt="Left Foot"
                className="sheep-accessory sheep-foot-left"
              />
              <img
                src={rightHand}
                alt="Left Hand"
                className="sheep-accessory sheep-hand-left"
              />
              <button className="gift-box-button">Gift Box</button>
              <button className="blind-box-button">Blind Box</button>
              <button className="detox-box-button">Detox Box</button>
            </div>
          </div>
          </>}
          {isMobile &&
          <>
          <div className='mascot-mainpage-image'>
            <img src={mascot1} alt="Vegie Care Logo" className="brand-logo-mainpage" />
          </div>
          </>}
        </section>
      
      <div className='normal-spacing'></div> 
        <section className='intro-section'>
            <div className="intro-container">
                <div className="intro-brand">
                  <img src={mascotSmile} alt="Mascot Vegie Care" className="mascot-intro" />
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
              {boxesData.map((box) => {
                const isHovered = hoveredBox === box.id;
                const getBackgroundImage = () => {
                  if (box.id === 1) return monTronBack;
                  if (box.id === 2) return tronViAnBack;
                  return null;
                };
                const getFrontImage = () => {
                  if (box.id === 1) return monTronFront;
                  if (box.id === 2) return tronViAnFront;
                  return null;
                };

                return (
                  <div 
                    key={box.id} 
                    className={`product-box-card ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredBox(box.id)}
                    onMouseLeave={() => setHoveredBox(null)}
                  >
                    {/* Background image - ẩn ban đầu, hiện khi hover */}
                    <div 
                      className="box-background-image"
                      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
                    />
                    
                    {/* Front image - trượt từ dưới lên */}
                    <img 
                      src={getFrontImage()} 
                      alt={box.title}
                      className="box-front-image"
                    />

                    <div className="box-number">{box.number}</div>
                    <div className="box-content">
                      <h3 className="box-title">{box.title}</h3>
                      <p className="box-description">{box.description}</p>
                      <button className="box-details-button">Xem chi tiết</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
     
      </div>
    </>
  );
}