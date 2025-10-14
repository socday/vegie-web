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
  totalPrice: number;
  finalPrice: number;
  discountCode: string | null;
  details: OrderDetailDTO[];
}

export interface BoxTypeDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  parentID: string;
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
  
  
  if (res.data?.isSuccess) return res.data.data as StatisticsResponse;
  return null;
}


