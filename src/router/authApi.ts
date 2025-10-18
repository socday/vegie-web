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
    // Try with current token
    const response = await api.get("/Auth/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.data.isSuccess){
      localStorage.removeItem("accessToken");
      console.log(response);
      return { isAuthenticated: false, user: null, token: null };
    }
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
            isAuthenticated: refreshRes.status === 200,
            user: refreshRes.data,
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
    localStorage.removeItem("accessToken");
    console.error("Auth check failed:", error);
    return { isAuthenticated: false, user: null, token: null };
  }
}

  export async function forgotPassword(email: string): Promise<any> {
    
  }

