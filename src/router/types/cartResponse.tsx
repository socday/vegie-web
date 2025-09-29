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
