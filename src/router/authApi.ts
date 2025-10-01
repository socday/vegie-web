import axios from "axios";
import { api } from "./api";
import { LoginRequest, LoginResponse } from "./types/authResponse";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function checkAuth() {
  let token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token) {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    // Try with current token
    const response = await api.get("/Auth/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (refreshToken) {
      try {
        console.log("DANG REFRESH TOKEN");
        const refreshRes = await api.post(
          "/Auth/refresh-token",
          { refreshToken }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (refreshRes.data?.isSuccess) {
          const newToken = refreshRes.data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          console.log("REFRESH SUCCESS");
          const retryRes = await api.get("/Auth/current-user");
          return {
            isAuthenticated: retryRes.status === 200,
            user: retryRes.data,
            token: newToken,
          };
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    return {
      isAuthenticated: response.status === 200,
      user: response.data,
      token,
    };
  } catch (error: any) {
    console.error("Auth check failed:", error);


    return { isAuthenticated: false, user: null, token: null };
  }
}

