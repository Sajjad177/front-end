import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth-service";
import { useAuthStore } from "@/stores/auth-store";
import { useNotify } from "@/stores/notification-store";
import { ROUTES } from "@/constants/routes";
import { LoginInput, RegisterInput } from "@/schemas";

export function useLoginMutation() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const notify = useNotify();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      const { user, token, refreshToken } = response.data;
      setAuth(user, token, refreshToken);
      notify.success("Login successful!");
      router.push(ROUTES.DASHBOARD.OVERVIEW);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      notify.error(err.message || "Failed to log in");
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const notify = useNotify();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: () => {
      notify.success("Registration successful! Please login.");
      router.push(ROUTES.AUTH.LOGIN);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      notify.error(err.message || "Failed to register");
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const notify = useNotify();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      notify.success("Logged out successfully");
      router.push(ROUTES.AUTH.LOGIN);
    },
    onError: () => {
      // Force clear state locally even if server logout fails
      clearAuth();
      router.push(ROUTES.AUTH.LOGIN);
    },
  });
}
