import { ReactNode } from "react";

interface WebsiteLayoutProps {
  children: ReactNode;
}

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Public website header will go here */}
      <header className="border-b bg-background px-6 py-4">
        <span className="font-semibold">Website Navigation Header</span>
      </header>
      <main className="flex-1">{children}</main>
      {/* Public website footer will go here */}
      <footer className="border-t bg-muted px-6 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Enterprise SaaS. All rights reserved.
      </footer>
    </div>
  );
}
