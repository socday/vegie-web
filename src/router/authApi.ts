import axios from "axios";
import { api } from "./api";
import { changePasswordRequest, Customer, GetCustomerResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types/authResponse";
import { useNavigate } from "react-router-dom";
import { AttachFnType } from "@react-three/fiber";

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
  const res = await api.post<RegisterResponse> ("/Auth/", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

  export async function forgotPassword(email: string): Promise<any> {
    const res = await api.post<any> ("/Auth/forgot-password",
      { email }, 
      {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }

  export async function getCustomer (): Promise<GetCustomerResponse> {
    const res = await api.get<GetCustomerResponse> ("/Customers/me", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }

// Helper function to refresh access token
async function refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string } | null> {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    return null;
  }

  try {
    console.log("Refreshing token...");
    const refreshRes = await api.post("/Auth/refresh-token", { refreshToken });

    if (refreshRes.data?.isSuccess && refreshRes.data.data?.accessToken) {
      const newToken = refreshRes.data.data.accessToken;
      const newRefreshToken = refreshRes.data.data.refreshToken; // Nếu API trả về refreshToken mới
      
      localStorage.setItem("accessToken", newToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }
      
      console.log("Token refreshed successfully");
      return { accessToken: newToken, refreshToken: newRefreshToken };
    }
  } catch (refreshError: any) {
    console.error("Token refresh failed:", refreshError);
  }

  return null;
}

export async function checkAuth() {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    const response = await api.get("/Auth/check-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data.isSuccess) {
      // Token is still valid, return success
      return {
        isAuthenticated: true,
        user: response.data,
        token,
      };
    }
  } catch (error: any) {
    // Only refresh if it's a 401 Unauthorized error
    if (error.response?.status === 401) {
      const refreshResult = await refreshAccessToken();
      
      if (refreshResult) {
        // Retry with new token
        try {
          const retryResponse = await api.get("/Auth/current-user", {
            headers: { Authorization: `Bearer ${refreshResult.accessToken}` },
          });
          
          if (retryResponse.data.isSuccess) {
            return {
              isAuthenticated: true,
              user: retryResponse.data,
              token: refreshResult.accessToken,
            };
          }
        } catch (retryError) {
          console.error("Retry after refresh failed:", retryError);
        }
      }
    } else {
      // Other errors (network, 500, etc.) - don't try to refresh
      console.error("Auth check failed:", error);
    }
  }
  
  // Both current token and refresh failed
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return { isAuthenticated: false, user: null, token: null };
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
  console.log("DANG UPDATE CUSTOMER");
  const isFormData = payload instanceof FormData;

  const res = await api.put("/Customers/me", payload, {
    headers: {
      "Content-Type": isFormData
        ? "multipart/form-data"
        : "application/json",
    },
  });

  return res.data;
}

export async function resetPasswordForm(data: {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}) {
  try {
    const res = await api.post("/Auth/reset-password", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data ?? { isSuccess: false, message: "Unknown response" };
  } catch (err: any) {
    console.error("Error resetting password:", err);
    return {
      isSuccess: false,
      message: err.response?.data?.message || "Lỗi khôi phục mật khẩu",
    };
  }
}

export async function loginWithGoogle(accessToken: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login/google", 
    { tokenId: accessToken }, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}