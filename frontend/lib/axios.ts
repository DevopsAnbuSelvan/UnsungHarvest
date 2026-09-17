import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/api";
import { firebaseAuth } from "@/lib/firebase";
import { useAuthStore } from "@/store/auth.store";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let token: string | null = null;

  const currentUser = firebaseAuth.currentUser;
  if (currentUser) {
    token = await currentUser.getIdToken();
  } else {
    token = useAuthStore.getState().accessToken;
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const body = response.data as { success?: boolean; data?: unknown };
    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "data" in body
    ) {
      response.data = body.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await firebaseAuth.signOut().catch(() => undefined);
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
