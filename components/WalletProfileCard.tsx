"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletProfileCardProps {
  address: string;
  solBalance: number;
}

export function WalletProfileCard({ address, solBalance }: WalletProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy address");
    }
  };

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Wallet
      </h2>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-lg font-semibold">{truncatedAddress}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy address to clipboard"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Balance
        </h3>
        <p className="mt-1 text-3xl font-bold tracking-tight">
          {solBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}{" "}
          <span className="text-xl font-medium text-muted-foreground">SOL</span>
        </p>
      </div>
    </div>
  );
}
