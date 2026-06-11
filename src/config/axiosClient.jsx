import axios from "axios";
import { cookies } from "next/headers";
import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  responseType: "json",
  validateStatus: () => true,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  async (config) => {
    let token = null;

    if (typeof window === "undefined") {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get("sessionToken")?.value;
      } catch (err) {
        console.error("Error accessing cookies on server:", err);
      }
    } else {
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
