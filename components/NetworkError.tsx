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
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h3 className="mb-2 text-lg font-semibold">Unable to Load Data</h3>

        <p className="mb-4 text-sm text-muted-foreground">{message}</p>

        <Button onClick={handleRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
