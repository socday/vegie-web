import { api } from "./api";

export interface OrderDetailDTO {
  boxTypeId: string;
  boxName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  status: string;
  orderDate: string;
  totalPrice: number;
  finalPrice: number;
  discountCode: string | null;
  address: string;
  deliveryTo: string;
  phoneNumber: string;
  allergyNote: string | null;
  preferenceNote: string | null;
  paymentMethod: string;
  paymentStatus: string;
  payOSPaymentUrl: string | null;
  payOSOrderCode: string | null;
  details: OrderDetailDTO[];
}

export interface BoxTypeDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  parentID: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  date: string;
  dietaryPreferences: string;
  cookingSkillLevel: string;
}

export interface RecipeData {
  id: string;
  dishName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  estimatedCookingTime: string;
  cookingTips: string;
  imageUrl: string;
  date: string;
  createdAt: string;
}

export interface GenerateRecipeResponse {
  isSuccess: boolean;
  data: RecipeData;
  message: string;
  exception: string | null;
}

export async function generateRecipe(payload: GenerateRecipeRequest): Promise<GenerateRecipeResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.post<GenerateRecipeResponse>("/admin/ai-recipes/generate", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export interface DeleteRecipeResponse {
  isSuccess: boolean;
  message: string;
  exception: string | null;
}

export async function deleteRecipe(recipeId: string): Promise<DeleteRecipeResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.delete<DeleteRecipeResponse>(`/api/Aimenu/recipes/${recipeId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export interface MyRecipesResponse {
  isSuccess: boolean;
  data: {
    items: RecipeData[];
  };
  message: string;
  exception: string | null;
}

export async function getMyRecipes(): Promise<MyRecipesResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await api.get<MyRecipesResponse>("/AiMenu/my-recipes", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function getAllOrders(): Promise<OrderDTO[]> {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/orders", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.data?.isSuccess) return res.data.data as OrderDTO[];
  return [];
}

export async function getAllBoxTypes(): Promise<BoxTypeDTO[]> {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/BoxTypes", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.data?.isSuccess) return res.data.data as BoxTypeDTO[];
  return [];
}

export interface StatisticsResponse {
  totalOrders: number;
  paidOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalDiscount: number;
  totalProductsSold: number;
  topProducts: Array<{
    boxTypeName: string;
    quantitySold: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    userId: string;
    userName: string;
    totalSpent: number;
    orderCount: number;
  }>;
  paymentMethodStats: Record<string, number>;
  deliveryMethodStats: Record<string, number>;
  revenueByDate: Array<{
    date: string;
    revenue: number;
    orderCount: number;
  }>;
}

export async function getStatistics(startDate: string, endDate: string): Promise<StatisticsResponse | null> {
  const token = localStorage.getItem("accessToken");
  
  const res = await api.get("/Statistics", {
    params: { start: startDate, end: endDate },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  
  
  if (res.data?.isSuccess) {
    console.log(res.data.data)
    return res.data.data as StatisticsResponse
  };
  return null;
}


// Discounts (Coupons)
export interface DiscountDTO {
  id?: string;
  code: string;
  description: string;
  discountValue: number;
  isPercentage: boolean;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  isActive?: boolean;
}

export async function getDiscounts(): Promise<DiscountDTO[]> {
  const token = localStorage.getItem("accessToken");
  const res = await api.get("/Discounts", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.data?.isSuccess) return res.data.data as DiscountDTO[];
  return [];
}

export async function getDiscount(id: string): Promise<DiscountDTO | null> {
  const token = localStorage.getItem("accessToken");
  const res = await api.get(`/Discounts/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (res.data?.isSuccess) return res.data.data as DiscountDTO;
  return null;
}

export async function createDiscount(payload: DiscountDTO): Promise<boolean> {
  const token = localStorage.getItem("accessToken");
  const res = await api.post("/Discounts", payload, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return !!res.data?.isSuccess;
}

export async function updateDiscount(id: string, payload: DiscountDTO): Promise<boolean> {
  const token = localStorage.getItem("accessToken");
  const res = await api.put(`/Discounts/${id}`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return !!res.data?.isSuccess;
}

export async function deleteDiscount(id: string): Promise<boolean> {
  const token = localStorage.getItem("accessToken");
  const res = await api.delete(`/Discounts/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return !!res.data?.isSuccess;
}

