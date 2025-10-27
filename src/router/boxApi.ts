import { api } from "./api";
import { BlindBoxAIResponse, Recipe } from "./types/boxResponse";

export async function getBoxTypeName(id: string): Promise<string> {

  const token = localStorage.getItem("accessToken");
  try {
    const res = await api.get(`/BoxTypes/${id}`,{
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });
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

export async function blindBoxAi(vegetables: string[]): Promise<BlindBoxAIResponse> {
  const token = localStorage.getItem("accessToken");

  if (vegetables.length === 0) {
    return await recentRecipes(1);
  }

  try {
    const res = await api.post(
      '/AiMenu/generate-recipes',
      { vegetables },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Normalize structure
    const raw = res.data;

    let data: Recipe[] = [];

    if (Array.isArray(raw.data)) {
      data = raw.data;
    } else if (raw.data?.recipe) {
      data = [raw.data.recipe];
    }

    return {
      isSuccess: raw.isSuccess ?? false,
      data,
      message: raw.message ?? "",
    };
  } catch (err) {
    console.error("Error generating recipes:", err);
    return { isSuccess: false, data: [], message: "Error generating recipes" };
  }
}

export async function getAiLetterSuggestion(receiver:string, mainWish: string, occasion: string): Promise<any> {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await api.post(
      '/AI/generate-wish',
      { receiver, occasion, mainWish },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Error generating AI letter suggestion:", err);
    return { isSuccess: false, data: [], message: "Error generating AI letter suggestion" };
  }

}