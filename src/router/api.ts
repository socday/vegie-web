// src/api/api.ts
import axios from "axios";

// read base URL from .env
// const API_URL = "/api"; // Use proxy in development
const API_URL = "https://exe-be-qu8u.onrender.com/api"; 
// const API_URL = "http://localhost:5071/api"; 
// or process.env.REACT_APP_API_URL if you're on Create React App

export const api = axios.create({
  baseURL: API_URL,   
  timeout: 15000,     // optional: 10s timeout
});

// Log all requests
// Log all requests
api.interceptors.request.use((config) => {
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


// Refresh token logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Log all responses and handle token refresh
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

    // Check if error is 401 and not a refresh token request
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/Auth/refresh-token")
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
          const refreshRes = await api.post("/Auth/refresh-token", { refreshToken });

          if (refreshRes.data?.isSuccess && refreshRes.data.data?.accessToken) {
            const newToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken;

            localStorage.setItem("accessToken", newToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Process queued requests with new token
            processQueue(null, newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            isRefreshing = false;
            return api(originalRequest);
          } else {
            // Refresh failed
            processQueue(new Error("Token refresh failed"));
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            
            // Redirect to login if not already there
            if (window.location.pathname !== "/login" && window.location.pathname !== "/admin/login") {
              window.location.href = "/login";
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          processQueue(refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          
          if (window.location.pathname !== "/login" && window.location.pathname !== "/admin/login") {
            window.location.href = "/login";
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available
        processQueue(new Error("No refresh token"));
        localStorage.removeItem("accessToken");
        
        if (window.location.pathname !== "/login" && window.location.pathname !== "/admin/login") {
          window.location.href = "/login";
        }
        isRefreshing = false;
      }
    }

    // Log other errors
    if (axios.isAxiosError(error)) {
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

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });