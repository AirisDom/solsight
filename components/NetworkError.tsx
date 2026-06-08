"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NetworkErrorProps {
  message: string;
}

export function NetworkError({ message }: NetworkErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-colors duration-300 hover:border-destructive/30 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <div className="animate-subtle-pulse mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 sm:mb-4 sm:h-12 sm:w-12">
          <AlertTriangle className="h-5 w-5 text-destructive sm:h-6 sm:w-6" />
        </div>

        <h3 className="mb-2 text-base font-semibold sm:text-lg">Unable to Load Data</h3>

        <p className="mb-4 text-xs text-muted-foreground sm:text-sm">{message}</p>

        <Button onClick={handleRetry} variant="outline" className="group h-10 px-4 transition-all duration-200 hover:scale-105 active:scale-95 sm:h-9">
          <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
