import { useState } from "react";
import "../cart/styles/Cart.css"
import { removeCartItem } from "../../../../router/cartApi";
type CartItemProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  initialQuantity?: number;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, newQty: number) => void;
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
const handleRemove = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await removeCartItem(userId, id); // call backend
      onRemove(id); // update UI state
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };
  return (
    <div className="cart-item">
        <img src={image} alt={name} className="cart-image" />
        
             <div className="cart-name-remove">
        <h3>{name}</h3>
        <button
          onClick={handleRemove}
          className="d-btn-font cart-remove"
        >
          Remove
        </button>
      </div>
        <div className="cart-price-quantity">

          <div className="cart-quantity">
              <button onClick={decrease} className="cart-quantity-button cart-decrease-style">-</button>
              <span>{quantity}</span>
              <button onClick={increase} className="cart-quantity-button cart-increase-style">+</button>
          </div>
          <p className="cart-item-price">${price}</p>
        </div>

    </div>
  );
}