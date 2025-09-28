// api/cartApi.ts
import { api } from "./api";
import { CartResponse } from"./types/cartResponse";

export async function getCart(userId: string): Promise<CartResponse> {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No access token found. Please log in again.");
  }

  const res = await api.get<CartResponse>(`/Cart/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
}
