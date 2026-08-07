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

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, logout, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast({ title: "Welcome back!", type: "success" });
      router.push(ROLE_DASHBOARD[data.user.role]);
    },
    onError: () => {
      toast({ title: "Invalid credentials", type: "error" });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      toast({ title: "Account created!", type: "success" });
      router.push(ROLE_DASHBOARD[data.user.role]);
    },
    onError: () => {
      toast({ title: "Registration failed", type: "error" });
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
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
