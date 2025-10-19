// src/api/api.ts
import axios from "axios";

// read base URL from .env
// const API_URL = "/api"; // Use proxy in development
const API_URL = "https://exe-be-qu8u.onrender.com/api"; 
// const API_URL = "http://localhost:5071/api"; 
// or process.env.REACT_APP_API_URL if you're on Create React App

export const api = axios.create({
  baseURL: API_URL,   
  timeout: 5000,     // optional: 10s timeout
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


// Log all responses
api.interceptors.response.use(
   (response) => {
    // console.log("Response:", {
    //   status: response.status,
    //   headers: response.headers,
    //   data: response.data,
    // });
    // console.log("DATA LA", response.data);
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Axios Error Response:", {
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
        });
        return error.response; 
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