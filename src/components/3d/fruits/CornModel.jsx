import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Component cho mô hình bắp
// 🔧 ĐIỀU CHỈNH DEFAULT PROPS: Thay đổi giá trị mặc định cho position, scale, rotation
function CornModel({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, '/3D/fruits/corn.glb');
  
  // Apply material để dễ nhìn thấy
  const clonedScene = gltf.scene.clone();
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone();
      child.material.emissive = new THREE.Color(0x444444); // Phát sáng nhẹ
      child.material.emissiveIntensity = 0.2;
    }
  });

  return (
    <primitive 
      object={clonedScene} 
      position={position}
      scale={scale}
      rotation={rotation}
    />
  );
}

// Component với Suspense wrapper
export default function Corn({ position, scale, rotation }) {
  return (
    <Suspense fallback={
      <mesh position={position}>
        {/* 🔧 ĐIỀU CHỈNH KÍCH THƯỚC FALLBACK: Thay đổi [0.2, 0.2, 0.2] để điều chỉnh kích thước khi model chưa load */}
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    }>
      <CornModel position={position} scale={scale} rotation={rotation} />
    </Suspense>
  );
}
