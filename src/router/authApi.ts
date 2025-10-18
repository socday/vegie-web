import axios from "axios";
import { api } from "./api";
import { changePasswordRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types/authResponse";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function registerUser (payload: RegisterRequest) : Promise <RegisterResponse>
{
  const res = await api.post<RegisterResponse> ("/Customers", payload, {
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export async function changePassword (payload: changePasswordRequest) : Promise <RegisterResponse>
{
  let token = localStorage.getItem("accessToken");
  const res = await api.post<RegisterResponse> ("/Auth/", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
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
    // Try with current token first
    const response = await api.get("/Auth/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data.isSuccess) {
      // Token is still valid, return success
      return {
        isAuthenticated: true,
        user: response.data,
        token,
      };
    } else {
      // Token is invalid, try to refresh
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
            console.log("REFRESH SUCCESS");
            return {
              isAuthenticated: true,
              user: refreshRes.data,
              token: newToken,
            };
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }
      
      // Both current token and refresh failed
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return { isAuthenticated: false, user: null, token: null };
    }
  } catch (error: any) {
    // Network error or token expired, try refresh
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
          console.log("REFRESH SUCCESS");
          return {
            isAuthenticated: true,
            user: refreshRes.data,
            token: newToken,
          };
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, user: null, token: null };
  }
}

  export async function forgotPassword(email: string): Promise<any> {
    
  }

