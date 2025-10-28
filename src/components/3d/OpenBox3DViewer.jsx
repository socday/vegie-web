import React, { useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { Box3, Sphere, Vector3 } from 'three';
import * as THREE from 'three';
import FruitAnimation from './FruitAnimation';

// Function để apply màu carton cho model (giống Box3DViewer)
function applyCartonMaterial(scene) {
  const cartonMaterial = new THREE.MeshStandardMaterial({
    color: '#654321', // Màu nâu carton rất đậm
    roughness: 0.8,
    metalness: 0.1,
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      // Force thay đổi material
      child.material = cartonMaterial.clone();
      child.material.needsUpdate = true;
      console.log('Applied carton material to mesh:', child.name);
    }
  });
}

// Component để load và hiển thị hộp mở (giống Box3DViewer)
function OpenBox1({ position, rotation, onLoaded }) {
  const gltf = useLoader(GLTFLoader, '/3D/hộp mở/Hop_1 (3).glb');
  
  React.useEffect(() => {
    if (gltf.scene && onLoaded) {
      console.log('OpenBox1 loaded successfully');
      const clonedScene = gltf.scene.clone();
      applyCartonMaterial(clonedScene);
      onLoaded(clonedScene);
    }
  }, [gltf.scene, onLoaded]);

  return (
    <primitive 
      object={gltf.scene} 
      position={position} 
      rotation={rotation}
      scale={[1, 1, 1]}
    />
  );
}

function OpenBox2({ position, rotation, onLoaded }) {
  const gltf = useLoader(GLTFLoader, '/3D/hộp mở/Hop_2 (3).glb');
  
  React.useEffect(() => {
    if (gltf.scene && onLoaded) {
      console.log('OpenBox2 loaded successfully');
      const clonedScene = gltf.scene.clone();
      applyCartonMaterial(clonedScene);
      onLoaded(clonedScene);
    }
  }, [gltf.scene, onLoaded]);

  return (
    <primitive 
      object={gltf.scene} 
      position={position} 
      rotation={rotation}
      scale={[1, 1, 1]}
    />
  );
}

// Component để fit camera - điều chỉnh để nhìn mặt bên phải và bên trong hộp
function FitCameraToObject({ object3D }) {
  const { camera } = useThree();
  React.useEffect(() => {
    if (object3D) {
      const box = new Box3().setFromObject(object3D);
      const sphere = new Sphere();
      box.getBoundingSphere(sphere);
      
      // Camera gần hộp hơn và nhìn mặt bên phải
      const distance = sphere.radius * 1.3; // Giảm từ 4 xuống 1.5 để gần hơn
    
      // Đặt camera ở mặt bên phải của hộp và cao hơn để nhìn bên trong
      camera.position.set(
        distance,           // X: mặt bên phải của hộp
        sphere.radius * 2, // Y: cao hơn để nhìn xuống bên trong hộp
        sphere.radius * 0.7  // Z: hơi lùi về phía sau một chút
      );
      camera.lookAt(0, 0, 0); // Nhìn vào trung tâm hộp
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
function OpenBox3DViewer({ currentBox, fruitAnimation, removeFruit, selectedFruits }) {
  const [obj3D, setObj3D] = useState(null);
  
  // Debug: Log để kiểm tra currentBox và selectedFruits
  console.log('OpenBox3DViewer received currentBox:', currentBox);
  console.log('OpenBox3DViewer received selectedFruits:', selectedFruits);

  return (
    <ErrorBoundary currentBox={currentBox}>
      <div className="box3d-viewer">
        <Canvas
          camera={{ position: [2, 1.5, 1], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#666" />
            </mesh>
          }>
            {currentBox === 1 ? (
              <OpenBox1 position={[0, 0, 0]} rotation={[0, 0, 0]} onLoaded={setObj3D} />
            ) : (
              <OpenBox2 position={[0, 0, 0]} rotation={[0, 0, 0]} onLoaded={setObj3D} />
            )}
          </Suspense>
          
          {/* Hiệu ứng trái cây rơi */}
          {fruitAnimation && (
            <FruitAnimation
              fruitType={fruitAnimation.fruitType}
              isActive={fruitAnimation.isActive}
              onComplete={fruitAnimation.onComplete}
              removeFruit={removeFruit}
              selectedFruits={selectedFruits}
            />
          )}
          
          <FitCameraToObject object3D={obj3D} />
          
          {/* Debug: Hiển thị vị trí của hộp - điều chỉnh theo hộp thực */}
          {obj3D && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 0.6, 0.4]} />
              <meshBasicMaterial color="red" wireframe={true} />
            </mesh>
          )}
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

export default OpenBox3DViewer;
