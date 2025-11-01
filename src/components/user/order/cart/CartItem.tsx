import { useEffect, useState } from "react";
import "../cart/styles/Cart.css";
import BlindBoxImage from "../../../../assets/images/webp/blind-box-object.webp";

type CartItemProps = {
  id: string;
  cartId: string;
  name: string;
  price: number;
  image: string;
  initialQuantity?: number;
  onRemove: (cartId: string) => void;
  onQuantityChange: (cartId: string, newQty: number) => void;
};

export default function CartItem({
  id,
  cartId,
  name,
  price,
  image,
  initialQuantity = 1,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increase = () => setQuantity(q => q + 1);
  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : q));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (quantity !== initialQuantity) {
        onQuantityChange(cartId, quantity);
      }
    }, 1000); 

    return () => clearTimeout(timer);
  }, [quantity]);

  return (
    <div className="cart-item">
      <img src={image || BlindBoxImage} alt={name} className="cart-image" />

      <div className="cart-name-remove">
        <h3>{name}</h3>
        <button
          onClick={() => onRemove(cartId)}
          className="d-btn-font cart-remove"
        >
          Remove
        </button>
      </div>

      <div className="cart-price-quantity">
        <div className="cart-quantity">
          <button
            onClick={decrease}
            className="cart-quantity-button cart-decrease-style "
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={increase}
            className="cart-quantity-button cart-increase-style "
          >
            +
          </button>
        </div>
        <p className="cart-item-price">{price.toLocaleString()}đ</p>
      </div>
    </div>
  );
}
