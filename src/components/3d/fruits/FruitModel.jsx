import React from 'react';
import Carrot from './CarrotModel';
import Cauliflower from './CauliflowerModel';
import Corn from './CornModel';
import Tomato from './TomatoModel';

// Component tổng hợp để render trái cây theo loại
export default function FruitModel({ fruitType, position, scale, rotation }) {
  const props = { position, scale, rotation };
  
  switch (fruitType) {
    case 'Cà rốt':
      return <Carrot {...props} />;
    case 'Súp lơ':
      return <Cauliflower {...props} />;
    case 'Bắp':
      return <Corn {...props} />;
    case 'Cà chua':
      return <Tomato {...props} />;
    default:
      // Fallback cho trái cây không xác định
      return (
        <mesh position={position}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      );
  }
}
