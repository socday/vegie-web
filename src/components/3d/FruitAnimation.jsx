import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3 } from 'three';
import * as THREE from 'three';
import FruitModel from './fruits/FruitModel';

// Component cho từng trái cây rơi - sử dụng FruitModel với quantity
function FallingFruit({ fruitType, position, onComplete, quantity = 1 }) {
  const meshRef = useRef();
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const [isFalling, setIsFalling] = useState(true);
  
  console.log(' FallingFruit created for:', fruitType, 'quantity:', quantity, 'at position:', position);
  
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
      console.log(` ${fruitType} (qty:${quantity}) position:`, {
        x: meshRef.current.position.x.toFixed(3),
        y: meshRef.current.position.y.toFixed(3),
        z: meshRef.current.position.z.toFixed(3),
        layout: `X=${meshRef.current.position.x.toFixed(3)}, Z=${meshRef.current.position.z.toFixed(3)}`
      });
    }
    
    // Check if reached inside the box (y < 0.5) - rơi vào đáy hộp thực
    // 🔧 ĐIỀU CHỈNH ĐIỂM DỪNG: Thay đổi giá trị này để trái cây dừng ở độ cao khác nhau trong hộp
    if (meshRef.current.position.y < 0.5) {
      console.log(` ${fruitType} (qty:${quantity}) reached inside box, stopping animation`);
      setIsFalling(false);
      // KHÔNG gọi onComplete - để trái cây tồn tại trong hộp
    }
  });
  
  return (
    <group ref={meshRef}>
      <FruitModel 
        fruitType={fruitType}
        quantity={quantity}
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
function FruitAnimation({ fruitType, isActive, onComplete, removeFruit, selectedFruits }) {
  const [fruits, setFruits] = useState([]);
  const [boxDimensions, setBoxDimensions] = useState({ width: 0.8, depth: 0.6 });
  
  console.log(' FruitAnimation render:', { fruitType, isActive, fruitsCount: fruits.length, selectedFruits });
  
  // Callback để nhận kích thước hộp thực
  const handleBoxSizeCalculated = (dimensions) => {
    console.log(' Received box dimensions:', dimensions);
    setBoxDimensions(dimensions);
  };
  
  useEffect(() => {
    console.log(' FruitAnimation useEffect:', { fruitType, isActive, selectedFruits });
    if (isActive && fruitType && selectedFruits) {
      console.log(' Creating fruit animations for:', fruitType, 'with quantity:', selectedFruits[fruitType]);
      
      // Sắp xếp tất cả trái cây nằm ngang theo chiều dài hộp (cùng một hàng)
      const fruitOrder = ['Cà rốt', 'Súp lơ', 'Bắp', 'Cà chua'];
      const fruitIndex = fruitOrder.indexOf(fruitType);
      
      // Lấy số lượng hiện tại của loại trái cây này (đã được cập nhật)
      const currentQuantity = selectedFruits[fruitType] || 0;
      
      // Tính quantity cho trái cây mới (số lượng vừa được thêm)
      const newFruitQuantity = currentQuantity;
      
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
        currentQuantity,
        newFruitQuantity,
        boxWidth: boxWidth.toFixed(3),
        boxDepth: boxDepth.toFixed(3),
        x: x.toFixed(3),
        y: y.toFixed(3),
        z: z.toFixed(3),
        position: startPosition,
        layout: `Single row layout: ${fruitType} at position ${fruitIndex} with quantity ${newFruitQuantity}`
      });
      
      // Kiểm tra xem đã có trái cây với quantity này chưa
      const existingFruit = fruits.find(f => 
        f.fruitType === fruitType && f.quantity === newFruitQuantity
      );
      
      if (!existingFruit) {
        // Tạo trái cây mới với quantity tương ứng
        const newFruit = {
          id: Date.now(),
          fruitType,
          quantity: newFruitQuantity,
          position: startPosition,
          isFalling: true
        };
        
        setFruits(prev => {
          console.log(' Adding fruit to list:', newFruit);
          return [...prev, newFruit];
        });
      } else {
        console.log(' Fruit with quantity', newFruitQuantity, 'already exists, skipping creation');
      }
    }
  }, [isActive, fruitType, boxDimensions, selectedFruits, fruits]);
  
  // Effect để sync trái cây với selectedFruits (hiển thị tất cả trái cây từ 1 đến số lượng đã chọn)
  useEffect(() => {
    if (selectedFruits) {
      console.log(' Syncing fruits with selectedFruits:', selectedFruits);
      
      // Tạo danh sách trái cây cần có
      const requiredFruits = [];
      
      Object.entries(selectedFruits).forEach(([fruitType, quantity]) => {
        if (quantity > 0) {
          // Tạo trái cây từ 1 đến quantity
          for (let i = 1; i <= quantity; i++) {
            requiredFruits.push({
              fruitType,
              quantity: i,
              id: `${fruitType}_${i}`,
              position: new THREE.Vector3(0, 1.5, 0), // Position sẽ được tính lại
              isFalling: false
            });
          }
        }
      });
      
      // Cập nhật danh sách trái cây
      setFruits(prev => {
        // Xóa tất cả trái cây cũ
        const newFruits = [];
        
        // Thêm trái cây mới
        requiredFruits.forEach(requiredFruit => {
          const existingFruit = prev.find(f => 
            f.fruitType === requiredFruit.fruitType && f.quantity === requiredFruit.quantity
          );
          
          if (existingFruit) {
            // Giữ nguyên trái cây đã có
            newFruits.push(existingFruit);
          } else {
            // Tạo trái cây mới
            const fruitOrder = ['Cà rốt', 'Súp lơ', 'Bắp', 'Cà chua'];
            const fruitIndex = fruitOrder.indexOf(requiredFruit.fruitType);
            
            const boxWidth = boxDimensions.width * 0.7;
            const x = -boxWidth/2 + (fruitIndex + 0.5) * (boxWidth / 4);
            const z = 0;
            const y = 1.5;
            
            newFruits.push({
              ...requiredFruit,
              id: Date.now() + Math.random(),
              position: new THREE.Vector3(x, y, z),
              isFalling: true
            });
          }
        });
        
        console.log(' Synced fruits:', newFruits.map(f => `${f.fruitType} ${f.quantity}`));
        return newFruits;
      });
    }
  }, [selectedFruits, boxDimensions]);
  
  // Effect để xử lý remove fruit (đơn giản hóa vì đã có sync effect)
  useEffect(() => {
    if (removeFruit && removeFruit.fruitType) {
      console.log(' Remove fruit triggered:', removeFruit.fruitType, 'quantity:', removeFruit.quantity);
      // Logic xóa sẽ được xử lý bởi sync effect ở trên
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
            quantity={fruit.quantity}
            position={fruit.position}
            onComplete={() => handleFruitComplete(fruit.id)}
          />
        );
      })}
    </>
  );
}

export default FruitAnimation;
