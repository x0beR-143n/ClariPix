import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  // We use Bearer token, not cookies → avoid CORS credential mode
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken") ||
      process.env.NEXT_PUBLIC_BEARER_TOKEN ||
      undefined;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default http;
