// api/orderApi.ts
import { api } from "./api"; 
import { CreateGiftBoxRequest, CreateGiftBoxResponse, CreateOrderRequest, CreateOrderResponse, Order, OrderResponse, PaymentLinkResponse, UpdateOrderStatusRequest, UpdateOrderStatusResponse } from "./types/orderResponse";

export async function getOrder(): Promise<OrderResponse> {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("User not authenticated");
  }

  const res = await api.get<OrderResponse>(`/Orders/customer/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getOrders(): Promise<OrderResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.get<OrderResponse>("/Orders", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// POST /api/Orders
export async function createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.post<CreateOrderResponse>("/Orders", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// GET /api/Orders/{id}
export async function getOrderById(id: string): Promise<{ isSuccess: boolean; data: Order; message: string; exception: string | null; }> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.get<{ isSuccess: boolean; data: Order; message: string; exception: string | null; }>(`/Orders/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// PUT /api/Orders/{id}/cancel
export async function cancelOrder(id: string): Promise<{ isSuccess: boolean; data: Order; message: string; exception: string | null; }> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.put<{ isSuccess: boolean; data: Order; message: string; exception: string | null; }>(`/Orders/${id}/cancel`, null, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// PUT /api/Orders/status
export async function updateOrdersStatus(payload: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.put<UpdateOrderStatusResponse>(`/Orders/status`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getPaymentLink(orderId: string): Promise<PaymentLinkResponse> {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await api.post(
      `/Orders/${orderId}/payos/payment-link`, // URL
      {}, // no body payload
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching payment link:", error);
    throw error;
  }
}


export async function createGiftBoxOrder(
  vegetables: string[],
  greetingMessage: string,
  quantity: number
): Promise<CreateGiftBoxResponse> {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  const payload: CreateGiftBoxRequest = {
    userId: userId || "",
    vegetables,
    greetingMessage,
    quantity,
    discountCode: "",
    deliveryMethod: 0,
    paymentMethod: 0,
    address: "",
    deliveryTo: "",
    phoneNumber: ""
  };

  try {
    const response = await api.post<CreateGiftBoxResponse>(
      "/GiftBox/create-order",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create order failed:", error);
    return {
      isSuccess: false,
      message: "Failed to create order",
      exception: error.message
    };
  }

  
}