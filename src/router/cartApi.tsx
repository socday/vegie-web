import { api } from "./api";
import { getBoxTypeName } from "./boxApi";
import { AddToCartRequest, AddToCartResponse, CartCheckOut, CartResponse, DiscountResponse, Item } from "./types/cartResponse";

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

  console.log("Cart API data:", apiData);
  // fetch box names in parallel
  const items: Item[] = await Promise.all(
    apiData.items.map(async (i: any) => {
      const name = await getBoxTypeName(i.boxTypeId);
      return {
        cartId: i.id,
        id: i.boxTypeId,
        name,
        price: i.unitPrice,
        image: "", // still placeholder, backend doesn’t send it, true
        quantity: i.quantity,
      };
    })
  );
  console.log("Processed cart items:", items);

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
  return api.put(
    `/Cart/${userId}/items/${boxTypeId}?quantity=${quantity}`,
    {}, 
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function cartCheckout (userId: string, checkOut: CartCheckOut) {
  return api.post(
    `/Cart/${userId}/checkout`,
    checkOut,
    { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
  )
}

export async function addCartItem(userId: string, boxTypeId: string, quantity: number) {
  const token = localStorage.getItem("accessToken");
  return api.post(
    `/Cart/${userId}/items`,
    { boxTypeId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function addToCart(payload: AddToCartRequest): Promise<AddToCartResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.post<AddToCartResponse>("/GiftBox/add-to-cart", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}


export async function validateDiscountCode(code: string): Promise<DiscountResponse> {
  try {
    const response = await api.get(`/Discounts/validate/${code}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    return response.data; // returns the JSON you showed
  } catch (error: any) {
    console.error("Error validating discount code:", error);
    throw error;
  }
}

export async function deleteCart(orderDetailId: string): Promise<CartResponse> {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("User not authenticated");
  }

  const res = await api.delete(`/Cart/${userId}/items/${orderDetailId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}