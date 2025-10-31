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
  const res = await api.post<RegisterResponse> ("/Auth/", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

  export async function forgotPassword(email: string): Promise<any> {
    // TODO: Implement forgot password logic
  }

  export async function getCustomer (): Promise<GetCustomerResponse> {
    const res = await api.get<GetCustomerResponse> ("/Customers/me", {
      headers: {
        "Content-Type": "application/json",
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