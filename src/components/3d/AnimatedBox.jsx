import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Component hộp với animation thật
function AnimatedBox({ boxNumber, isClosed, onClick, onLoaded, isAnimating, onAnimationComplete }) {
  const groupRef = useRef();
  const openBoxRef = useRef();
  const closedBoxRef = useRef();

  const animationProgress = useRef(isClosed ? 1 : 0);
  const targetProgress = useRef(isClosed ? 1 : 0);

  // Load cả 2 models - sử dụng đường dẫn của project vegie-web
  const openGltf = useLoader(GLTFLoader, `/3D/hộp mở/Hop_${boxNumber} (3).glb`);
  const closedGltf = useLoader(GLTFLoader, `/3D/hộp đóng/Hop_${boxNumber}.glb`);

  useEffect(() => {
    if (openGltf.scene && closedGltf.scene) {
      // Clone và GIỮ NGUYÊN màu gốc
      const openClone = openGltf.scene.clone();
      const closedClone = closedGltf.scene.clone();

      // Đảm bảo scale ban đầu - closedBox nhỏ hơn một chút
      openClone.scale.set(1, 1, 1);
      closedClone.scale.set(0.95, 0.95, 0.95);

      openBoxRef.current = openClone;
      closedBoxRef.current = closedClone;

      if (onLoaded) {
        onLoaded(isClosed ? closedClone : openClone);
      }

      console.log(`AnimatedBox ${boxNumber} loaded both models`);
    }
  }, [openGltf.scene, closedGltf.scene, boxNumber, onLoaded, isClosed]);

  // Update target khi isClosed thay đổi
  useEffect(() => {
    targetProgress.current = isClosed ? 1 : 0;
    console.log('Target progress updated:', targetProgress.current);
  }, [isClosed]);

  // Animation loop
  useFrame(() => {
    if (!groupRef.current || !openBoxRef.current || !closedBoxRef.current) return;

    const current = animationProgress.current;
    const target = targetProgress.current;

    // Smooth interpolation
    if (Math.abs(current - target) > 0.01) {
      const speed = 0.08;
      animationProgress.current += (target - current) * speed;

      const openOpacity = 1 - animationProgress.current;
      const closedOpacity = animationProgress.current;

      // Set opacity - GIỮ NGUYÊN màu gốc
      openBoxRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = openOpacity;
        }
      });

      closedBoxRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = closedOpacity;
        }
      });

      // Giữ nguyên kích thước - closedBox nhỏ hơn một chút
      openBoxRef.current.scale.set(1, 1, 1);
      closedBoxRef.current.scale.set(0.95, 0.95, 0.95);

    } else if (Math.abs(current - target) <= 0.01 && current !== target) {
      animationProgress.current = target;

      if (target === 1) {
        // Closed
        openBoxRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 0;
          }
        });
        closedBoxRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 1;
            child.material.transparent = false;
          }
        });
        // Đảm bảo scale - closedBox nhỏ hơn một chút
        openBoxRef.current.scale.set(1, 1, 1);
        closedBoxRef.current.scale.set(0.95, 0.95, 0.95);
      } else {
        // Open
        openBoxRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 1;
            child.material.transparent = false;
          }
        });
        closedBoxRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 0;
          }
        });
        // Đảm bảo scale - closedBox nhỏ hơn một chút
        openBoxRef.current.scale.set(1, 1, 1);
        closedBoxRef.current.scale.set(0.95, 0.95, 0.95);
      }

      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  });

  return (
    <group ref={groupRef} onClick={onClick}>
      {openBoxRef.current && <primitive object={openBoxRef.current} position={[0, 0, 0]} />}
      {closedBoxRef.current && <primitive object={closedBoxRef.current} position={[0, 0, 0]} />}
    </group>
  );
}

export default AnimatedBox;