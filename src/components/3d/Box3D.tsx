import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box3DViewer from './Box3DViewer';
import '../../css/Box3D.css';

interface Box3DLocationState {
  selectedFruits: Record<string, number>;
}

export default function Box3D() {
  const [currentBox, setCurrentBox] = useState(1);
  const navigate = useNavigate();
  const location = useLocation() as { state: Box3DLocationState };
  const selectedFruits = location.state?.selectedFruits;

  const handleContinue = () => {
    navigate('/letters', { state: { selectedBox: currentBox, selectedFruits } });
  };

  console.log("Received selected fruits:", selectedFruits);

  return (
    <div className="box3d-page">
      <main className="figma-main-content">
        <div className="model-viewer-container">
          <Box3DViewer currentBox={currentBox} />

          <div className="prompt-banner">
            Hãy chọn mẫu hộp bạn thích nhé!
          </div>

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

          {/* ✅ Show selected fruits */}


          <button className="continue-btn" onClick={handleContinue}>
            Tiếp tục
          </button>
        </div>  
      </main>
    </div>
  );
}