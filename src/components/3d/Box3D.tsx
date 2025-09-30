import React from 'react';
import Box3DViewer from './Box3DViewer';
import '../../css/Box3D.css';

export default function Box3D () {
  return (
    <div className="box3d-page">
      <section className="content-section">
        <div className="content-container">
          <div className="content-placeholder">
            {/* 3D Box Viewer */}
            <div className="model-container">
              <Box3DViewer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

