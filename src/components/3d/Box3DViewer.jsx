import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Sphere, Vector3 } from 'three';
import * as THREE from 'three';

// Component tự động điều chỉnh camera
function FitCameraToObject({ object3D }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  React.useEffect(() => {
    if (!object3D) return
    const box = new Box3().setFromObject(object3D)
    const sphere = new Sphere()
    box.getBoundingSphere(sphere)
    const center = sphere.center
    const radius = sphere.radius
    // Tính khoảng cách theo FOV để mô hình nằm gọn trong khung
    const fov = camera.fov * (Math.PI / 180)
    const distance = radius / Math.sin(fov / 2) * 1.2
    const direction = new Vector3(1, 0.6, 1).normalize()
    const newPos = center.clone().add(direction.multiplyScalar(distance))
    camera.position.copy(newPos)
    camera.near = Math.max(0.01, radius / 100)
    camera.far = radius * 100
    camera.updateProjectionMatrix()
    if (controls) {
      controls.target.copy(center)
      controls.update()
    }
  }, [object3D, camera, controls])
  return null
}

// Function để apply màu carton cho model
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

// Component cho Box 1 - Load model GLB
function Box1({ position, rotation, onLoaded }) {
  const gltf = useLoader(GLTFLoader, '/3D/hộp đóng/Hop_1.glb');
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  // Gọi callback khi đã có scene để fit camera
  React.useEffect(() => {
    if (groupRef.current && gltf?.scene && onLoaded) {
      const clonedScene = gltf.scene.clone();
      applyCartonMaterial(clonedScene);
      onLoaded(groupRef.current)
    }
  }, [gltf, onLoaded])

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive 
        ref={meshRef}
        object={gltf.scene.clone()} 
        scale={[1, 1, 1]}
      />
    </group>
  );
}

// Component cho Box 2 - Load model GLB với scale khác
function Box2({ position, rotation, onLoaded }) {
  const gltf = useLoader(GLTFLoader, '/3D/hộp đóng/Hop_2.glb');
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  // Gọi callback khi đã có scene để fit camera
  React.useEffect(() => {
    if (groupRef.current && gltf?.scene && onLoaded) {
      const clonedScene = gltf.scene.clone();
      applyCartonMaterial(clonedScene);
      onLoaded(groupRef.current)
    }
  }, [gltf, onLoaded])

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive 
        ref={meshRef}
        object={gltf.scene.clone()} 
        scale={[1, 1, 1]}
      />
    </group>
  );
}

// Component chính
function Box3DViewer({ currentBox }) {
  const [obj3D, setObj3D] = useState(null);

  return (
    <div className="box3d-viewer">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={<mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#666" /></mesh>}>
          {currentBox === 1 ? (
            <Box1 position={[0, 0, 0]} rotation={[0, 0, 0]} onLoaded={setObj3D} />
          ) : (
            <Box2 position={[0, 0, 0]} rotation={[0, 0, 0]} onLoaded={setObj3D} />
          )}
        </Suspense>
        
        <FitCameraToObject object3D={obj3D} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}

export default Box3DViewer;