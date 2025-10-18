export type Box = {
    id: string;
    name: string;
    description: string;
    price: number;
}

export type Recipe = {
    id: string;
    dishName: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    estimatedCookingTime: string;
    cookingTips: string;
    imageUrl: string;
}

export type BlindBoxAIResponse = {
    isSuccess: boolean;
    data: Recipe[];
    message: string;
    exception?: string;
}