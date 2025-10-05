import React, { Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Component cho mô hình súp lơ
function CauliflowerModel({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0] }) {
  const gltf = useLoader(GLTFLoader, '/3D/fruits/cauliflower.glb');
  
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
export default function Cauliflower({ position, scale, rotation }) {
  return (
    <Suspense fallback={
      <mesh position={position}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
    }>
      <CauliflowerModel position={position} scale={scale} rotation={rotation} />
    </Suspense>
  );
}
