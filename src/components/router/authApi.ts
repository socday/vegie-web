import { api } from "./api";
import { LoginRequest, LoginResponse } from "./authResponse";

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/Auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("REQUEST DATA");
  return res.data;
}