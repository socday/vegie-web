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
  let token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token) {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    console.log("HERE");
    const response = await api.get("/Auth/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      isAuthenticated: response.status === 200,
      user: response.data,
      token,
    };
  } catch (error: any) {
    console.error("Auth check failed:", error);

    // Only attempt refresh if we have a refresh token
    if (refreshToken) {
      try {
        const refreshRes = await api.post("/Auth/refresh-token", {
          refreshToken,
        });

        if (refreshRes.data?.isSuccess) {
          const newToken = refreshRes.data.data.accessToken;

          // Save new token in localStorage
          localStorage.setItem("accessToken", newToken);
          token = newToken;

          // Retry current-user with the new token
          const retryRes = await api.get("/Auth/current-user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          return {
            isAuthenticated: retryRes.status === 200,
            user: retryRes.data,
            token,
          };
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    // If refresh also fails → force logout
    return { isAuthenticated: false, user: null, token: null };
  }
}
