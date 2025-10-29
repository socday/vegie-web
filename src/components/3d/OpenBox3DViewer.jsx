import React, { useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box3, Sphere } from 'three';
import * as THREE from 'three';
import AnimatedBox from './AnimatedBox';
import FruitAnimation from './FruitAnimation';

// Component để fit camera
function FitCameraToObject({ object3D }) {
  const { camera } = useThree();
  React.useEffect(() => {
    if (object3D) {
      const box = new Box3().setFromObject(object3D);
      const sphere = new Sphere();
      box.getBoundingSphere(sphere);
      
      const distance = sphere.radius * 1.3;

      camera.position.set(
        distance,
        sphere.radius * 2,
        sphere.radius * 0.7
      );
      camera.lookAt(0, 0, 0);
    }
  }, [object3D, camera]);

  return null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OpenBox3DViewer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#f0f0f0',
          color: '#666'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3>Error loading 3D model</h3>
            <p>Box {this.props.currentBox} failed to load</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component chính
function OpenBox3DViewer({ currentBox, fruitAnimation, removeFruit, selectedFruits = {} }) {
  const [obj3D, setObj3D] = useState(null);
  const [isClosed, setIsClosed] = useState(true); // BẮT ĐẦU VỚI HỘP ĐÓNG
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBoxClick = (e) => {
    // Chỉ toggle khi không phải đang drag/rotate
    if (e.delta <= 2 && !isAnimating) {
      console.log('Box clicked! Toggling state...');
      setIsAnimating(true);
      setIsClosed(!isClosed);
    } else if (e.delta > 2) {
      console.log('Box dragged, not toggling. Delta:', e.delta);
    }
  };

  const handleAnimationComplete = () => {
    console.log('Animation completed');
    setIsAnimating(false);
  };

  return (
    <ErrorBoundary currentBox={currentBox}>
      <div className="box3d-viewer" style={{ position: 'relative' }}>
        <Canvas
          camera={{ position: [2, 1.5, 1], fov: 50 }}
          style={{
            width: '100%',
            height: '100%',
            cursor: isUserInteracting ? 'grabbing' : 'pointer'
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, 5, -5]} intensity={0.3} />

          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#666" />
            </mesh>
          }>
            <AnimatedBox
              boxNumber={currentBox}
              isClosed={isClosed}
              onClick={handleBoxClick}
              onLoaded={setObj3D}
              isAnimating={isAnimating}
              onAnimationComplete={handleAnimationComplete}
            />

            {/* Hiệu ứng trái cây rơi - sử dụng component gốc */}
            {!isClosed && !isAnimating && fruitAnimation && (
              <FruitAnimation
                fruitType={fruitAnimation.fruitType}
                isActive={fruitAnimation.isActive}
                onComplete={fruitAnimation.onComplete}
                removeFruit={removeFruit}
                selectedFruits={selectedFruits}
              />
            )}
          </Suspense>

          <FitCameraToObject object3D={obj3D} />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
            onStart={() => setIsUserInteracting(true)}
            onEnd={() => setIsUserInteracting(false)}
            enabled={!isAnimating}
            makeDefault
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

export default OpenBox3DViewer;
