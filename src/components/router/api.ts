// src/api/api.ts
import axios from "axios";

// read base URL from .env
const API_URL = import.meta.env.VITE_API_URL; 
// or process.env.REACT_APP_API_URL if you're on Create React App

export const api = axios.create({
  baseURL: API_URL,   // example: http://localhost:5071/api
  timeout: 10000,     // optional: 10s timeout
});

// Log all requests
api.interceptors.request.use((config) => {
  console.log("➡️ Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Log all responses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("❌ Error Response:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    } else {
      console.error("❌ Request setup error:", error.message);
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