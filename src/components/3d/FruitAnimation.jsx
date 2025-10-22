import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3 } from 'three';
import * as THREE from 'three';
import FruitModel from './fruits/FruitModel';

// Component cho từng trái cây rơi - sử dụng FruitModel
function FallingFruit({ fruitType, position, onComplete }) {
  const meshRef = useRef();
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const [isFalling, setIsFalling] = useState(true);
  
  console.log(' FallingFruit created for:', fruitType, 'at position:', position);
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
    }
  }, [position]);
  
  useFrame(() => {
    if (!isFalling || !meshRef.current) return;
    
    // Gravity effect - chậm hơn để dễ quan sát
    // 🔧 ĐIỀU CHỈNH TỐC ĐỘ RƠI: Thay đổi giá trị này để làm trái cây rơi nhanh/chậm hơn
    const gravity = 0.0005;
    velocityRef.current.y -= gravity;
    
    // Update position
    meshRef.current.position.add(velocityRef.current);
    
    // Debug position every 30 frames
    if (Math.floor(Date.now() / 100) % 3 === 0) {
      console.log(` ${fruitType} position:`, {
        x: meshRef.current.position.x.toFixed(3),
        y: meshRef.current.position.y.toFixed(3),
        z: meshRef.current.position.z.toFixed(3),
        layout: `X=${meshRef.current.position.x.toFixed(3)}, Z=${meshRef.current.position.z.toFixed(3)}`
      });
    }
    
    // Check if reached inside the box (y < 0.5) - rơi vào đáy hộp thực
    // 🔧 ĐIỀU CHỈNH ĐIỂM DỪNG: Thay đổi giá trị này để trái cây dừng ở độ cao khác nhau trong hộp
    if (meshRef.current.position.y < 0.5) {
      console.log(` ${fruitType} reached inside box, stopping animation`);
      setIsFalling(false);
      // KHÔNG gọi onComplete - để trái cây tồn tại trong hộp
    }
  });
  
  return (
    <group ref={meshRef}>
      <FruitModel 
        fruitType={fruitType}
        position={[-5, 0, -25]}
        // 🔧 ĐIỀU CHỈNH KÍCH THƯỚC TRÁI CÂY: Thay đổi giá trị [15, 15, 15] để làm trái cây to/nhỏ hơn
        scale={[20, 20, 20]}
        rotation={[5, 5, 5]}
      />
    </group>
  );
}

// Component để tính toán kích thước hộp thực
function BoxSizeCalculator({ onBoxSizeCalculated }) {
  const { scene } = useThree();
  
  useEffect(() => {
    // Tìm hộp trong scene
    const boxObject = scene.children.find(child => 
      child.name && (child.name.includes('Hop') || child.name.includes('Box'))
    );
    
    if (boxObject) {
      const box = new Box3().setFromObject(boxObject);
      const size = box.getSize(new THREE.Vector3());
      
      console.log(' Box size calculated:', {
        width: size.x,
        height: size.y,
        depth: size.z,
        box: box
      });
      
      // Gọi callback với kích thước thực
      onBoxSizeCalculated({
        width: size.x,
        depth: size.z,
        height: size.y
      });
    }
  }, [scene, onBoxSizeCalculated]);
  
  return null;
}

// Component chính cho animation trái cây - sử dụng BoxSizeCalculator để tính grid
function FruitAnimation({ fruitType, isActive, onComplete, removeFruit }) {
  const [fruits, setFruits] = useState([]);
  const [boxDimensions, setBoxDimensions] = useState({ width: 0.8, depth: 0.6 });
  
  console.log(' FruitAnimation render:', { fruitType, isActive, fruitsCount: fruits.length });
  
  // Callback để nhận kích thước hộp thực
  const handleBoxSizeCalculated = (dimensions) => {
    console.log(' Received box dimensions:', dimensions);
    setBoxDimensions(dimensions);
  };
  
  useEffect(() => {
    console.log(' FruitAnimation useEffect:', { fruitType, isActive });
    if (isActive && fruitType) {
      console.log(' Creating new fruit animation for:', fruitType);
      
      // Sắp xếp tất cả trái cây nằm ngang theo chiều dài hộp (cùng một hàng)
      const fruitOrder = ['Cà rốt', 'Súp lơ', 'Bắp', 'Cà chua'];
      const fruitIndex = fruitOrder.indexOf(fruitType);
      
      // Đếm số trái cây cùng loại hiện có
      const sameTypeCount = fruits.filter(f => f.fruitType === fruitType).length;
      
      // Tính toán vị trí - tất cả nằm ngang theo chiều dài hộp
      // 🔧 ĐIỀU CHỈNH KÍCH THƯỚC VÙNG ĐẶT TRÁI CÂY: Thay đổi 0.7 để trái cây gần/xa mép hộp hơn
      const boxWidth = boxDimensions.width * 0.7;  // Thu nhỏ 30% để chắc chắn trong hộp
      const boxDepth = boxDimensions.depth * 0.7;   // Thu nhỏ 30%
      
      // Vị trí X: chia đều theo chiều ngang của hộp
      // 🔧 ĐIỀU CHỈNH VỊ TRÍ NGANG: Thay đổi công thức này để sắp xếp trái cây khác nhau
      const x = -boxWidth/2 + (fruitIndex + 0.5) * (boxWidth / 4);
      
      // Vị trí Z: TẤT CẢ CÙNG MỘT HÀNG (giữa hộp)
      // 🔧 ĐIỀU CHỈNH VỊ TRÍ SÂU: Thay đổi giá trị này để trái cây ở phía trước/sau hộp
      const z = 0; // Tất cả ở giữa hộp
      
      // Vị trí Y: cao hơn để rơi vào hộp
      // 🔧 ĐIỀU CHỈNH ĐỘ CAO BAN ĐẦU: Thay đổi giá trị này để trái cây bắt đầu rơi từ cao/thấp hơn
      const y = 1.5;
      
      const startPosition = new THREE.Vector3(x, y, z);
      
      console.log(' Fruit positioning:', {
        fruitType,
        fruitIndex,
        sameTypeCount,
        boxWidth: boxWidth.toFixed(3),
        boxDepth: boxDepth.toFixed(3),
        x: x.toFixed(3),
        y: y.toFixed(3),
        z: z.toFixed(3),
        position: startPosition,
        layout: `Single row layout: ${fruitType} at position ${fruitIndex}`
      });
      
      // Thêm trái cây mới vào danh sách
      const newFruit = {
        id: Date.now(),
        fruitType,
        position: startPosition,
        isFalling: true
      };
      
      setFruits(prev => {
        console.log(' Adding fruit to list:', newFruit);
        return [...prev, newFruit];
      });
    }
  }, [isActive, fruitType, boxDimensions]);
  
  // Effect để xử lý remove fruit
  useEffect(() => {
    if (removeFruit && removeFruit.fruitType) {
      console.log(' Removing fruit:', removeFruit.fruitType);
      setFruits(prev => {
        const filtered = prev.filter(fruit => fruit.fruitType !== removeFruit.fruitType);
        console.log(' Remaining fruits:', filtered.length);
        return filtered;
      });
    }
  }, [removeFruit]);
  
  // Debug: Log fruits array
  useEffect(() => {
    console.log(' Current fruits in box:', fruits.map(f => f.fruitType));
  }, [fruits]);
  
  const handleFruitComplete = (fruitId) => {
    // Xóa trái cây đã rơi xong
    setFruits(prev => prev.filter(fruit => fruit.id !== fruitId));
    onComplete && onComplete();
  };
  
  return (
    <>
      <BoxSizeCalculator onBoxSizeCalculated={handleBoxSizeCalculated} />
      {fruits.map(fruit => {
        console.log(' Rendering fruit:', fruit);
        return (
          <FallingFruit
            key={fruit.id}
            fruitType={fruit.fruitType}
            position={fruit.position}
            onComplete={() => handleFruitComplete(fruit.id)}
          />
        );
      })}
    </>
  );
}

export default FruitAnimation;
