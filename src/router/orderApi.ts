// api/orderApi.ts
import { api } from "./api"; 
import { OrderResponse } from "./types/orderResponse";

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