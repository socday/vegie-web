// src/api/api.ts
import axios from "axios";

// read base URL from .env
// const API_URL = "/api"; // Use proxy in development
// const API_URL = "https://exe-be-qu8u.onrender.com/api"; 
const API_URL = (import.meta as any).env.VITE_API_URL;
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
let silentRefreshTimer: ReturnType<typeof setTimeout> | null = null;


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
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          window.location.href = "/dang-nhap";
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

          const { accessToken, refreshToken: newRefresh, id } = refreshRes.data.data;
          console.log("✅ Token refreshed successfully:", {
            newAccessToken: accessToken,
            newRefreshToken: newRefresh,
          });

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefresh);
          if (id) localStorage.setItem("userId", id);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // Dispatch event to notify other tabs and components
          window.dispatchEvent(new Event("token-update"));

          isRefreshing = false;
          onRefreshed(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("❌ Token refresh failed:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          window.location.href = "/dang-nhap";
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
  // Clear any existing timer to prevent duplicates
  if (silentRefreshTimer) {
    clearTimeout(silentRefreshTimer);
    silentRefreshTimer = null;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const payload = decodeJWT(token);
  if (!payload?.exp) return;

  const expiresInMs = payload.exp * 1000 - Date.now();

  // If token expires in less than 60s, refresh immediately
  if (expiresInMs <= 60_000) {
    console.log("⚡ Token expiring soon, refreshing immediately");

    // Refresh immediately (no setTimeout)
    (async () => {
      if (isRefreshing) return;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          isRefreshing = false;
          return;
        }

        const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, {
          refreshToken,
        });

        // Ensure response has expected structure and is successful before using it
        if (!refreshRes.data || refreshRes.status !== 200 || !refreshRes.data.isSuccess || !refreshRes.data.data) {
          isRefreshing = false;
          return;
        }

        const { accessToken, refreshToken: newRefresh, id } = refreshRes.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        if (id) localStorage.setItem("userId", id);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        window.dispatchEvent(new Event("token-update"));

        isRefreshing = false;
        onRefreshed(accessToken);

        console.log("✅ Immediate refresh success");
        startSilentRefresh(); // schedule next
      } catch (error) {
        isRefreshing = false;
        console.error("❌ Immediate refresh failed:", error);
        return;
      }
    })();
    

    return;
  }

  const refreshBeforeMs = expiresInMs - 60_000; // refresh 60s before expiry
  console.log(`🕒 Silent refresh scheduled in ${Math.floor(refreshBeforeMs / 1000)}s`);

  silentRefreshTimer = setTimeout(async () => {
    // Check if refresh already in progress
    if (isRefreshing) {
      console.log("⏭️ Refresh already in progress, skipping silent refresh");
      return;
    }

    isRefreshing = true; // Set flag to prevent concurrent refreshes

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        isRefreshing = false;
        return;
      }

      console.log("🔁 Performing silent token refresh...");

      const refreshRes = await axios.post(`${API_URL}/Auth/refresh-token`, {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefresh, id } = refreshRes.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefresh);
      if (id) localStorage.setItem("userId", id);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      // Dispatch event to notify other tabs and components
      window.dispatchEvent(new Event("token-update"));

      isRefreshing = false; // Reset flag
      onRefreshed(accessToken); // Notify any waiting requests

      console.log("✅ Silent refresh success");
      startSilentRefresh(); // schedule next
    } catch (error) {
      isRefreshing = false; // Reset flag on error
      console.error("❌ Silent refresh failed:", error);

      // Retry once after 2 seconds instead of immediate logout
      setTimeout(() => {
        console.log("🔄 Retrying silent refresh...");
        startSilentRefresh();
      }, 2000);
    }
  }, refreshBeforeMs);
}

// === Stop Silent Refresh (cleanup on logout) ===
export function stopSilentRefresh() {
  if (silentRefreshTimer) {
    clearTimeout(silentRefreshTimer);
    silentRefreshTimer = null;
    console.log("🛑 Silent refresh timer cleared");
  }
}
