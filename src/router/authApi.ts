import axios from "axios";
import { api } from "./api";
import { changePasswordRequest, Customer, GetCustomerResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types/authResponse";
import { useNavigate } from "react-router-dom";

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

export async function changePassword (payload: changePasswordRequest) : Promise <any>
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
    const response = await api.get("/Auth/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.isSuccess) {
      return { isAuthenticated: true, user: response.data.data, token };
    }

    if (refreshToken) {
      const newToken = await tryRefreshToken(token, refreshToken);
      return { isAuthenticated: true, user: response.data.data, token: newToken };
    }
  } catch (error) {
    if (refreshToken) {
      try {
        const newToken = await tryRefreshToken(token, refreshToken);
        return { isAuthenticated: true, user: null, token: newToken };
      } catch {
        console.error("Token refresh failed:", error);
      }
    }
  }

  localStorage.clear();
  return { isAuthenticated: false, user: null, token: null };
}


async function tryRefreshToken(token: string, refreshToken: string) {
  const refreshRes = await api.post(
    "/Auth/refresh-token",
    { refreshToken },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (refreshRes.data?.isSuccess) {
    const newToken = refreshRes.data.data.accessToken;
    localStorage.setItem("accessToken", newToken);
    console.log("REFRESH SUCCESS");
    return newToken;
  }

  throw new Error("Refresh failed");
}

  export async function forgotPassword(email: string): Promise<any> {
    
  }

  export async function getCustomer (): Promise<GetCustomerResponse> {
    let token = localStorage.getItem("accessToken");
    const res = await api.get<GetCustomerResponse> ("/Customers/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    });
    return res.data;
  }

export async function updateCustomer(
  payload:
    | FormData
    | {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        gender: number;
        address: string;
        avatar: File | null;
      }
): Promise<Customer> {
  const token = localStorage.getItem("accessToken");
  const isFormData = payload instanceof FormData;

  const res = await api.put("/Customers/me", payload, {
    headers: {
      "Content-Type": isFormData
        ? "multipart/form-data"
        : "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}