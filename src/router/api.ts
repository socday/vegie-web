// src/api/api.ts
import axios from "axios";

// read base URL from .env
// const API_URL = "/api"; // Use proxy in development
const API_URL = "https://exe-be-qu8u.onrender.com/api"; 
// const API_URL = "http://localhost:5071/api"; 
// or process.env.REACT_APP_API_URL if you're on Create React App

// === Axios Base Config ===
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// === Token Refresh State ===
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// === Helper: Notify subscribers when refresh done ===
function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// === Helper: Queue new subscribers while refreshing ===
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// === Attach Access Token before each request ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.log("📤 API REQUEST START:", {
    url: fullUrl,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  return config;
});

// === Handle Responses & Errors ===
api.interceptors.response.use(
  (response) => {
    console.log("📥 API RESPONSE SUCCESS:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Axios errors
    if (axios.isAxiosError(error)) {
      console.log("⚠️ API RESPONSE ERROR:", {
        url: originalRequest?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      // === Handle 401 Unauthorized ===
      if (error.response?.status === 401 && !originalRequest._retry) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.warn("🚫 No refresh token — forcing logout");
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        if (isRefreshing) {
          console.log("⏳ Token refresh in progress — waiting subscriber");
          return new Promise((resolve) => {
            subscribeTokenRefresh((newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        console.log("🔄 Attempting token refresh...");

        try {
          const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefresh } = refreshRes.data.data;
          console.log("✅ Token refreshed successfully:", {
            newAccessToken: accessToken,
            newRefreshToken: newRefresh,
          });

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefresh);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          isRefreshing = false;
          onRefreshed(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("❌ Token refresh failed:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      // Other non-401 Axios errors
      if (error.response) {
        console.error("Axios Error Response:", {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        console.error("Axios No Response:", error.request);
      } else {
        console.error("Axios Config Error:", error.message);
      }
    } else {
      console.error("Non-Axios error caught:", error);
    }

    return Promise.reject(error);
  }
);

// === JWT Decode Helper ===
function decodeJWT(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    console.warn("⚠️ Failed to decode JWT");
    return null;
  }
}

// === Background Silent Refresh (pre-expiry) ===
export function startSilentRefresh() {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const payload = decodeJWT(token);
  if (!payload?.exp) return;

  const expiresInMs = payload.exp * 1000 - Date.now();
  const refreshBeforeMs = expiresInMs - 60_000; // refresh 60s before expiry

  if (refreshBeforeMs <= 0) return;

  console.log(`🕒 Silent refresh scheduled in ${Math.floor(refreshBeforeMs / 1000)}s`);

  setTimeout(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      console.log("🔁 Performing silent token refresh...");

      const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefresh } = refreshRes.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefresh);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      console.log("✅ Silent refresh success");
      startSilentRefresh(); // schedule next
    } catch (error) {
      console.error("❌ Silent refresh failed:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  }, refreshBeforeMs);
}
