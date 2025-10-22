import React from 'react';
import Carrot from './CarrotModel';
import Cauliflower from './CauliflowerModel';
import Corn from './CornModel';
import Tomato from './TomatoModel';

// Component tổng hợp để render trái cây theo loại
// 🔧 ĐIỀU CHỈNH PROPS: position, scale, rotation được truyền từ parent component
export default function FruitModel({ fruitType, position, scale, rotation }) {
  const props = { position, scale, rotation };
  
  switch (fruitType) {
    case 'Cà rốt':
      return <Carrot {...props}
      rotation={[1.25, 1.1, 1]}
      position={[0, 10, -13]}
      scale={[22.5, 22.5, 22.5]}
       />;
    case 'Súp lơ':
      return <Cauliflower 
        {...props}
        rotation={[1.25, 0.3, 1]}
        position={[8, -30, -45]}
        scale={[35, 35, 35]}
      />;
    case 'Bắp':
      return <Corn 
        {...props}
        rotation={[-0.7, 1.4, 0.1]}
        position={[-5, -14, -10]}
        scale={[30, 30, 30]}
      />;
    case 'Cà chua':
      return <Tomato 
        {...props}
        rotation={[0.8, 0.5, 0]}
        position={[-30, -18, 30]}
        scale={[20, 20, 20]}
      />;
    default:
      // Fallback cho trái cây không xác định
      // 🔧 ĐIỀU CHỈNH KÍCH THƯỚC FALLBACK: Thay đổi [0.2, 0.2, 0.2] để điều chỉnh kích thước mặc định
      return (
        <mesh position={position}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      );
  }
}
