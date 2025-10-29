import axios from "axios";
import { api } from "./api";
import { changePasswordRequest, Customer, GetCustomerResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./types/authResponse";

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
  // Nếu ko có accessToken => user ko hợp lệ
  if (!token) {
    return { isAuthenticated: false, user: null, token: null };
  }

  try {
    // Lấy current user xem hợp lệ không
    const response = await api.get("/Auth/current-user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (response.data.isSuccess) {
      // Hợp lệ trả về
      return {
        isAuthenticated: true,
        user: response.data,
        token,
      };
    } else {
      // Token hết hạn thì refresh
      if (refreshToken) {
        try {
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          console.log("DANG REFRESH TOKEN");
          const refreshRes = await api.post(
            "/Auth/refresh-token",
            { refreshToken }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // Refresh thành công thì trả thành công
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
      localStorage.removeItem("userId")
      return { isAuthenticated: false, user: null, token: null };
    }
  } catch (error: any) {
    // Có lỗi gì thử refresh, refresh ko đc thì cho đăng nhập
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
    // Nếu ko có refresh token thì cho đăng nhập lại
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId")
    return { isAuthenticated: false, user: null, token: null };
  }
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
        imgURL: string | File;
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