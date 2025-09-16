import { useState } from "react";
import "../cart/Cart.css"
type CartItemProps = {
  id: number;
  name: string;
  price: number;
  image: string;
  initialQuantity?: number;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, newQty: number) => void;
};

export default function CartItem({
  id,
  name,
  price,
  image,
  initialQuantity = 1,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increase = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);            
    onQuantityChange(id, newQty);   
  };

  const decrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(id, newQty);
    }
  };

  return (
    <div className="cart-item">
        <img src={image} alt={name} className="cart-image" />
        
        <div className="cart-name-remove">
            <h3 className="">{name}</h3>
            <button 
            onClick={() => onRemove(id)} 
            className="d-btn-font cart-remove"
            >
            Remove
            </button>
        </div>

        <p className="cart-item-price">${price}</p>
        <div className="cart-quantity">
            <button onClick={decrease} className="">-</button>
            <span>{quantity}</span>
            <button onClick={increase} className="">+</button>
        </div>

    </div>
  );
}