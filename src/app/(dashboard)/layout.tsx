import { ReactNode } from "react";
import { ProtectedRoute } from "@/features/auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-muted/20">
        {/* Sidebar Component will go here */}
        <aside className="w-64 border-r bg-card px-4 py-6 hidden md:block">
          <span className="font-bold text-lg">Dashboard Sidebar</span>
        </aside>
        
        <div className="flex flex-1 flex-col">
          {/* Dashboard Header Component will go here */}
          <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
            <span className="font-medium">Dashboard Top Navigation</span>
          </header>
          
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
