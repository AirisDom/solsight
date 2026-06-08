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
    <div className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:shadow-xl sm:p-6 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
        Wallet
      </h2>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-mono text-base font-semibold sm:text-lg">{truncatedAddress}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 transition-all duration-200 hover:scale-110 sm:h-8 sm:w-8"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy address to clipboard"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500 animate-in zoom-in duration-200" />
          ) : (
            <Copy className="h-4 w-4 transition-transform duration-200 hover:rotate-[-8deg]" />
          )}
        </Button>
      </div>

      <div className="mt-4 sm:mt-6">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
          Balance
        </h3>
        <p className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {solBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}{" "}
          <span className="text-lg font-medium text-muted-foreground sm:text-xl">SOL</span>
        </p>
      </div>
    </div>
  );
}
