import { api } from "./api";

export async function getBoxTypeName(id: string): Promise<string> {

  try {
    const res = await api.get(`/BoxTypes/${id}`);
    return res.data.data?.name ?? "Unknown Box";
  } catch (err: any) {
    if (err.response?.status === 404) {
      return "Unknown Box"; // fallback if not found
    }
    throw err; // rethrow other errors
  }
}