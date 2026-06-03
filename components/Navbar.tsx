"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { validateSolanaAddress } from "@/lib/solana";

export function Navbar() {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    if (!value.trim()) {
      setError(null);
      return;
    }

    const result = validateSolanaAddress(value);
    setError(result.valid ? null : result.error);
  };

  const isAddressValid = address.trim() && !error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError("Address cannot be empty");
      return;
    }

    const result = validateSolanaAddress(address);
    if (!result.valid) {
      setError(result.error);
      return;
    }

    setIsLoading(true);
    router.push(`/wallet/${encodeURIComponent(result.address)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-xl font-bold tracking-tight text-transparent"
        >
          SolSight
        </Link>

        <form onSubmit={handleSubmit} className="relative flex flex-1 max-w-md gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter Solana Address..."
              className="h-9 w-full text-sm"
              value={address}
              onChange={handleInputChange}
              aria-invalid={error ? true : undefined}
            />
            {error && (
              <p className="absolute left-0 top-full mt-1 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-9 shrink-0"
            disabled={isLoading || !isAddressValid}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="sr-only sm:not-sr-only sm:ml-2">Search</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
