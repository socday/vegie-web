import React from 'react';
import Carrot from './CarrotModel';
import Cauliflower from './CauliflowerModel';
import Corn from './CornModel';
import Tomato from './TomatoModel';

// Component tổng hợp để render trái cây theo loại và số lượng
// 🔧 ĐIỀU CHỈNH PROPS: position, scale, rotation được truyền từ parent component
export default function FruitModel({ fruitType, position, scale, rotation, quantity = 1 }) {
  const props = { position, scale, rotation };
  
  // Tạo key dựa trên fruitType và quantity để có vị trí khác nhau
  const fruitKey = `${fruitType} ${quantity}`;
  
  switch (fruitKey) {
    // === CÀ RỐT ===
    case 'Cà rốt 1':
      return <Carrot {...props}
        rotation={[1.25, 1.1, 1]}
        position={[0, 10, -13]}
        scale={[22.5, 22.5, 22.5]}
      />;
    case 'Cà rốt 2':
      return <Carrot {...props}
        rotation={[0.5, 1.5, 1]}
        position={[-10, -12, -13]}
        scale={[22.5, 22.5, 22.5]}
      />;
    case 'Cà rốt 3':
      return <Carrot {...props}
        rotation={[1.5, -1, 2]}
        position={[20, -19, 17]}
        scale={[22.5, 22.5, 22.5]}
      />;
    
    // === SÚP LƠ ===
    case 'Súp lơ 1':
      return <Cauliflower 
        {...props}
        rotation={[1.25, 0.3, 1]}
        position={[8, -30, -45]}
        scale={[35, 35, 35]}
      />;
    case 'Súp lơ 2':
      return <Cauliflower 
        {...props}
        rotation={[1.25, -0.3, 1]}
        position={[8.1, -30, -45]}
        scale={[35, 35, 35]}
      />;
    case 'Súp lơ 3':
      return <Cauliflower 
        {...props}
        rotation={[1.25, -0.1, 1]}
        position={[5, -25, -30]}
        scale={[35, 35, 35]}
      />;
    
    // === BẮP ===
    case 'Bắp 1':
      return <Corn 
        {...props}
        rotation={[-0.5, 2, 0.1]}
        position={[-20, -14, -10]}
        scale={[30, 30, 30]}
      />;
    case 'Bắp 2':
      return <Corn 
        {...props}
        rotation={[-0.7, 1.4, 0.1]}
        position={[-4.9, -14, -10]}
        scale={[30, 30, 30]}
      />;
    case 'Bắp 3':
      return <Corn 
        {...props}
        rotation={[-0.4, 1, 0.3]}
        position={[15, -20, -30]}
        scale={[30, 30, 30]}
      />;
    
    // === CÀ CHUA ===
    case 'Cà chua 1':
      return <Tomato 
        {...props}
        rotation={[0.8, 0.5, 0]}
        position={[-30, -18, 30]}
        scale={[20, 20, 20]}
      />;
    case 'Cà chua 2':
      return <Tomato 
        {...props}
        rotation={[0.8, 0.5, 0]}
        position={[-27, -18, 42.5]}
        scale={[20, 20, 20]}
      />;
    case 'Cà chua 3':
      return <Tomato 
        {...props}
        rotation={[0.8, 0.5, 0]}
        position={[-20, -10, 35.5]}
        scale={[20, 20, 20]}
      />;
    
    // Fallback cho các trường hợp không xác định
    default:
      // 🔧 ĐIỀU CHỈNH KÍCH THƯỚC FALLBACK: Thay đổi [0.2, 0.2, 0.2] để điều chỉnh kích thước mặc định
      return (
        <mesh position={position}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      );
  }
}
