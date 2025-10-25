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

export interface AddToCartRequest {
  userId: string;
  vegetables: string[];
  greetingMessage: string;
  boxDescription: string;
  letterScription: string;
  quantity: number;
}

export interface AddToCartResponse {
  isSuccess: boolean;
  data?: any; // adjust based on API response
  message: string;
  exception?: string | null;
}

export interface PhieuSucKhoeResponse {
  id: string;
  name: string;
  quantity: number;
  allergy?: string;
  feeling?: string;
}


export interface DiscountResponse {
  isSuccess: boolean;
  data: {
    id: string;
    code: string;
    description: string;
    discountValue: number;
    isPercentage: boolean;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  message: string;
  exception: string | null;
}