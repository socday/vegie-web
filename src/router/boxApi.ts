import { api } from "./api";
import { BlindBoxAIResponse } from "./types/boxResponse";

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

export async function recentRecipes(numberRecipe: number): Promise<BlindBoxAIResponse> {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return { isSuccess: false, data: [], message: "No access token" };
  }
  try {
    const res = await api.get('/AiMenu/recent-recipes', {
      params: { numberRecipe },
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
    return res.data ?? { isSuccess: false, data: [], message: "Error fetching recent recipes" };
  } catch (err) {
    console.error("Error fetching recent recipes:", err);
    return { isSuccess: false, data: [], message: "Error fetching recent recipes" };
  }
}

export async function blindBoxAi (vegetables: string[]): Promise<BlindBoxAIResponse> {
  if (vegetables.length === 0) {
    return await recentRecipes(1);
  }
  try {
    const res = await api.post('/AiMenu/generate-recipes', { vegetables });
    return res.data ?? await recentRecipes(1);
  }
  catch (err) {
    console.error("Error generating recipes:", err);
    return { isSuccess: false, data: [], message: "Error generating recipes" };
  }
}