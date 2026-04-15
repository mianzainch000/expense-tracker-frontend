import axios from "axios";
import { cookies } from "next/headers";
import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  responseType: "json",
  validateStatus: () => true,
  headers: { "Content-Type": "application/json" },
});

// Interceptor is now async to handle Next.js 15+ Cookies Promise
axiosClient.interceptors.request.use(
  async (config) => {
    let token = null;

    // Server-side Logic
    if (typeof window === "undefined") {
      try {
        // cookies() is a promise in newer Next.js versions
        const cookieStore = await cookies();
        token = cookieStore.get("sessionToken")?.value;
      } catch (err) {
        console.error("Error accessing cookies on server:", err);
      }
    }
    // Client-side Logic
    else {
      try {
        const match = document.cookie.match(/sessionToken=([^;]+)/);
        token = match ? match[1] : null;
      } catch (err) {
        console.error("Error accessing cookies on client:", err);
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
