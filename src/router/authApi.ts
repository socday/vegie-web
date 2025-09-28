import axios from "axios";
import { api } from "./api";
import { LoginRequest, LoginResponse } from "./types/authResponse";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("REQUEST DATA");
  return res.data;
}

export async function checkAuth() {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const response = await api.get("/Auth/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200 ? response.data : false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}