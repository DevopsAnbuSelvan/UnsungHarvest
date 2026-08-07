import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api";
import {
  mapAuthResponse,
  toLoginBody,
  toRegisterBody,
} from "@/utils/auth";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post(
      API_ENDPOINTS.auth.login,
      toLoginBody(payload)
    );
    return mapAuthResponse(data as Parameters<typeof mapAuthResponse>[0]);
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post(
      API_ENDPOINTS.auth.register,
      toRegisterBody(payload)
    );
    return mapAuthResponse(data as Parameters<typeof mapAuthResponse>[0]);
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>(API_ENDPOINTS.auth.me);
    return data;
  },
};
