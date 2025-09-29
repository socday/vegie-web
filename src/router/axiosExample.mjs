// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://exe-be-qu8u.onrender.com/api", // <-- change to your backend root
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

async function testApi() {
  const auth = await checkAuth();

  if (!auth.isAuthenticated || !auth.user) {
    throw new Error("User not authenticated");
  }

  const res = await api.get<CartResponse>(`/Cart/${auth.user.id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
  });

  return res.data;
}

export default testApi();

// //