"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!isAuthenticated || !token) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [isAuthenticated, token, router]);

  // Prevent flicker by showing a blank state or loader if not logged in
  if (!isAuthenticated || !token) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        {/* Simple loader placeholder */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
