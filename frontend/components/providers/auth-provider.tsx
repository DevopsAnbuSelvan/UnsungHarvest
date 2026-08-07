"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isTokenExpired, logout } = useAuthStore();

  useEffect(() => {
    const checkToken = () => {
      if (isTokenExpired()) {
        logout();
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 60_000);
    return () => clearInterval(interval);
  }, [isTokenExpired, logout]);

  return <>{children}</>;
}
