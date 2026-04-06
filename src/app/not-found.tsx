"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background text-foreground p-4 overflow-hidden relative w-full">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col items-center max-w-lg text-center animate-modal-scale relative z-10 w-full">
        <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/40 select-none mb-2">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        
        <p className="text-muted-foreground mb-10 text-base sm:text-lg max-w-[420px] mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button asChild size="lg" className="gap-2 font-medium rounded-full px-8 w-full sm:w-auto shadow-lg shadow-primary/20">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="gap-2 font-medium rounded-full px-8 w-full sm:w-auto bg-background/50 hover:bg-accent hover:text-accent-foreground cursor-pointer backdrop-blur-sm" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
