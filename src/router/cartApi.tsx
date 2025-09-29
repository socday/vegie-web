import { api } from "./api";
import { getBoxTypeName } from "./boxApi";
import { CartResponse, Item } from "./types/cartResponse";

export async function getCart(): Promise<CartResponse> {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("User not authenticated");
  }

  const res = await api.get(`/Cart/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const apiData = res.data.data;

  // fetch box names in parallel
  const items: Item[] = await Promise.all(
    apiData.items.map(async (i: any) => {
      const name = await getBoxTypeName(i.boxTypeId);
      return {
        id: i.id,
        name,
        price: i.unitPrice,
        image: "", // still placeholder, backend doesn’t send it
        quantity: i.quantity,
      };
    })
  );

  return {
    items,
    totalPrice: apiData.totalPrice,
  };
}

export async function removeCartItem(userId: string, orderDetailId: string): Promise<void> {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("User not authenticated");

  await api.delete(`/Cart/${userId}/items/${orderDetailId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateCartItem(userId: string, boxTypeId: string, quantity: number) {
  const token = localStorage.getItem("accessToken");
  return api.post(
    `/Cart/${userId}/items`,
    { boxTypeId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}