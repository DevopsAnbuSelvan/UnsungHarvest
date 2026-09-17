"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { ROLE_DASHBOARD } from "@/constants/routes";
import { useToast } from "@/components/ui/toast-context";

function authErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;
  const code = "code" in error ? String((error as { code: string }).code) : "";
  if (code === "auth/email-already-in-use") return "Email already in use";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password")
    return "Invalid credentials";
  if (code === "auth/user-not-found") return "Account not found";
  if (code === "auth/weak-password") return "Password is too weak";
  const response = (error as { response?: { data?: { message?: string } } })
    .response;
  if (response?.data?.message) return response.data.message;
  if ("message" in error && typeof error.message === "string") return error.message;
  return fallback;
}

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast({ title: "Welcome back!", type: "success" });
      router.push(ROLE_DASHBOARD[data.user.role]);
    },
    onError: (error) => {
      toast({
        title: authErrorMessage(error, "Invalid credentials"),
        type: "error",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast({ title: "Account created!", type: "success" });
      router.push(ROLE_DASHBOARD[data.user.role]);
    },
    onError: (error) => {
      toast({
        title: authErrorMessage(error, "Registration failed"),
        type: "error",
      });
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogout = async () => {
    await authService.logout();
  };

  return {
    user,
    isAuthenticated,
    loginForm,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
