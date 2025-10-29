// src/api/api.ts
import axios from "axios";

// read base URL from .env
// const API_URL = "/api"; // Use proxy in development
const API_URL = "https://exe-be-qu8u.onrender.com/api"; 
// const API_URL = "http://localhost:5071/api"; 
// or process.env.REACT_APP_API_URL if you're on Create React App
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// === Token refresh state ===
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Notify all waiting requests once new token is ready
function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// Subscribe new requests while refresh in progress
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// === Attach Access Token to every request ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.log("DIA CHI FULL", fullUrl);
  console.log("Api Request:", {
    url: fullUrl,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});

// === Handle all responses ===
api.interceptors.response.use(
  (response) => {
    console.log("Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    console.log("DATA LA", response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (axios.isAxiosError(error)) {
      // === Handle 401 Unauthorized ===
      if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Wait until current refresh finishes
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = refreshRes.data.data;

          // Save new tokens
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefresh);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;
          onRefreshed(accessToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("Refresh token failed:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // Other Axios error logs
      if (error.response) {
        console.error("Axios Error Response:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("Axios No Response received:", error.request);
      } else {
        console.error("Axios Request setup error:", error.message);
      }
    } else {
      console.error("Non-Axios error caught:", error);
    }

    return Promise.reject(error);
  }
);

//
// === Silent Background Token Refresh ===
// Refresh 1 minute before JWT expiry (if available)
//
function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function startSilentRefresh() {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const payload = decodeJWT(token);
  if (!payload?.exp) return;

  const expiresInMs = payload.exp * 1000 - Date.now();
  const refreshBeforeMs = expiresInMs - 10_000; // 1 minute before expiry

  if (refreshBeforeMs <= 0) return; // token already near expiry or invalid

  console.log(`Silent refresh scheduled in ${Math.floor(refreshBeforeMs / 1000)}s`);

  setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = refreshRes.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefresh);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      console.log("Silent token refresh success ✅");
      startSilentRefresh(); // schedule next refresh
    } catch (error) {
      console.error("Silent refresh failed:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  }, refreshBeforeMs);
}
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });