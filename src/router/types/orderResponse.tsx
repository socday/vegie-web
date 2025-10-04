// types/order.ts
export type OrderDetail = {
  boxTypeId: string;
  boxName: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  finalPrice: number;
  discountCode: string | null;
  details: OrderDetail[];
};

export type OrderResponse = {
  isSuccess: boolean;
  data: Order[];
  message: string;
  exception: string | null;
};