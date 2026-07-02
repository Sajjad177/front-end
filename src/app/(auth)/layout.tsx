import { ReactNode } from "react";
import { PublicRoute } from "@/features/auth";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </PublicRoute>
  );
}
