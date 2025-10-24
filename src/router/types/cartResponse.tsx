// types/cart.ts
export type Item = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export interface CartResponse {
  items: Item[];
  totalPrice: number;
}

export type CartCheckOut = {
  paymentMethod: number;
  deliveryMethod: number;
  discountCode: string;
  address: string;
  deliveryTo: string;
  phoneNumber: string;
}