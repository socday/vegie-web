import React, { Suspense } from 'react';
import * as THREE from 'three';
import useLazyGLTF from '../useLazyGLTF';

// Component cho mô hình cà chua
// 🔧 ĐIỀU CHỈNH DEFAULT PROPS: Thay đổi giá trị mặc định cho position, scale, rotation
function TomatoModel({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const gltf = useLazyGLTF('/3D/fruits/tomato.glb');

  if (!gltf) return null;

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
export default function Tomato({ position, scale, rotation }) {
  return (
    <Suspense fallback={
      <mesh position={position}>
        {/* 🔧 ĐIỀU CHỈNH KÍCH THƯỚC FALLBACK: Thay đổi [0.2, 0.2, 0.2] để điều chỉnh kích thước khi model chưa load */}
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#FF6347" />
      </mesh>
    }>
      <TomatoModel position={position} scale={scale} rotation={rotation} />
    </Suspense>
  );
}
