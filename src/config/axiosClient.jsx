import axios from "axios";
import { cookies } from "next/headers";
import { apiConfig } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: apiConfig.baseUrl,
  responseType: "json",
  validateStatus: () => true,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  let token;

  // Server-side
  try {
    token = cookies().get("sessionToken")?.value;
  } catch (err) {}

  // Client-side
  if (!token && typeof window !== "undefined") {
    const match = document.cookie.match(/sessionToken=([^;]+)/);
    token = match ? match[1] : null;
  }

  if (token) config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

export default axiosClient;
