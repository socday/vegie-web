import { api } from "./api";
import { Noti, NotiResponse } from "./types/notiResponse";

export async function fetchNotifications(): Promise<NotiResponse> {
    const token = localStorage.getItem("accessToken");
    const response = await api.get("/Notification", {
    headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data;
}