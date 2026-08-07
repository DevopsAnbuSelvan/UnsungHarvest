import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types/auth";

interface JwtPayload {
  exp: number;
  sub: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
}

function setAuthCookie(value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `unsung-harvest-auth=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "unsung-harvest-auth=; path=/; max-age=0";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        const state = JSON.stringify({
          state: { accessToken: token, user, isAuthenticated: true },
        });
        setAuthCookie(state);
        set({ accessToken: token, user, isAuthenticated: true });
      },

      logout: () => {
        clearAuthCookie();
        set({ accessToken: null, user: null, isAuthenticated: false });
      },

      isTokenExpired: () => {
        const token = get().accessToken;
        if (!token) return true;
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          return decoded.exp * 1000 < Date.now();
        } catch {
          return true;
        }
      },
    }),
    {
      name: "unsung-harvest-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.user) {
          const cookieVal = JSON.stringify({
            state: {
              accessToken: state.accessToken,
              user: state.user,
              isAuthenticated: true,
            },
          });
          setAuthCookie(cookieVal);
        }
      },
    }
  )
);
