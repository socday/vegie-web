// types/order.ts
export type OrderDetail = {
  boxTypeId: string;
  boxName: string;
  quantity: number;
  unitPrice: number;
};


export type ReviewOrder = {
  orderId: string;
  serviceQualityRating: number;
  productQualityRating: number;
  content: string;
};


export type Order = {
  id: string;
  userId: string;
  status: string; // e.g. "Pending" | "Completed"
  orderDate: string;
  finalPrice: number;
  discountCode: string | null;
  paymentMethod?: string | null; // e.g. "VNPay" | "PayOS" | "CashOnDelivery"
  paymentStatus?: string | null; // e.g. "Pending" | "Paid"
  payOSPaymentUrl?: string | null;
  payOSOrderCode?: string | null;
  details: OrderDetail[];
};

export type OrderResponse = {
  isSuccess: boolean;
  data: Order[];
  message: string;
  exception: string | null;
};

export type CreateOrderItem = {
  boxTypeId: string;
  quantity: number;
};

export type CreateOrderRequest = {
  userId: string;
  items: CreateOrderItem[];
  discountCode?: string | null;
  deliveryMethod: number;
  paymentMethod: number;
  address: string;
  deliveryTo: string;
  phoneNumber: string;
};

export type CreateOrderResponse = {
  isSuccess: boolean;
  data: Order;
  message: string;
  exception: string | null;
};

export type UpdateOrderStatusRequest = {
  orderIds: string[];
  status: number; // backend expects numeric enum
};

export type UpdateOrderStatusResponse = {
  isSuccess: boolean;
  data: Order[]; // assuming API returns affected orders; adjust if needed
  message: string;
  exception: string | null;
};

export interface PaymentLinkResponse {
  isSuccess: boolean;
  data: {
    paymentLinkId: string;
    paymentUrl: string;
    amount: number;
    description: string;
    orderCode: number;
    status: string;
  };
  message: string;
  exception: string | null;
}

// types/giftBox.ts
export interface CreateGiftBoxRequest {
  userId: string;
  vegetables: string[];
  greetingMessage: string;
  quantity: number;
  discountCode?: string;
  deliveryMethod: number;
  paymentMethod: number;
  address: string;
  deliveryTo: string;
  phoneNumber: string;
}

export interface CreateGiftBoxResponse {
  isSuccess: boolean;
  message: string;
  data?: any;
  exception?: string | null;
}