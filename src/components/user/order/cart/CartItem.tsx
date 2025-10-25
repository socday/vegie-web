import { useEffect, useState } from "react";
import "../cart/styles/Cart.css"
import { removeCartItem, updateCartItem } from "../../../../router/cartApi";
import BlindBoxImage from "../../../../assets/images/blind-box-object.png";
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
 const userId = localStorage.getItem("userId");
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
   
    if (!userId) return;

    try {
      await removeCartItem(userId, id); // call backend
      onRemove(id); // update UI state
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };
  useEffect(() => {
    if (image === "") {
      image = BlindBoxImage; 
    }
  });

  return (
    <div className="cart-item">
        
        <img src={image || BlindBoxImage} alt={name} className="cart-image" />
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
        </div>

    </div>
  );
}