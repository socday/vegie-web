import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box3DViewer from './Box3DViewer';
import '../../css/Box3D.css';

export default function Box3D () {
  const [currentBox, setCurrentBox] = useState(1);
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/letters', { state: { selectedBox: currentBox } });
  };

  return (
    <div className="box3d-page">
      
      <main className="figma-main-content">
        <div className="model-viewer-container">
          <Box3DViewer currentBox={currentBox} />
          
          {/* Prompt Banner riêng lẻ */}
          <div className="prompt-banner">
            Hãy chọn mẫu hộp bạn thích nhé!
          </div>
          
          {/* Box Selector riêng lẻ */}
          <div className="box-selector">
            <button 
              className={`box-btn ${currentBox === 1 ? 'active' : ''}`}
              onClick={() => setCurrentBox(1)}
              data-text="1"
            >
              <span style={{ color: 'transparent' }}>1</span>
            </button>
            <button 
              className={`box-btn ${currentBox === 2 ? 'active' : ''}`}
              onClick={() => setCurrentBox(2)}
              data-text="2"
            >
              <span style={{ color: 'transparent' }}>2</span>
            </button>
          </div>
          
          {/* Continue Button riêng lẻ */}
          <button className="continue-btn" onClick={handleContinue}>
            Tiếp tục
          </button>
        </div>
      </main>
    </div>
  );
};