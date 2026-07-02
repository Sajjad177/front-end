"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTES } from "@/constants/routes";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // If already logged in, send directly to dashboard overview page
    if (isAuthenticated && token) {
      router.push(ROUTES.DASHBOARD.OVERVIEW);
    }
  }, [isAuthenticated, token, router]);

  // Show loading indicator during redirection checks
  if (isAuthenticated && token) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
