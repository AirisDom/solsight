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
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:gap-4">
        <Link
          href="/"
          className="shrink-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl"
        >
          SolSight
        </Link>

        <form onSubmit={handleSubmit} className="relative flex min-w-0 flex-1 max-w-md gap-2">
          <div className="min-w-0 flex-1">
            <Input
              type="text"
              placeholder="Enter Solana Address..."
              className="h-10 w-full text-sm sm:h-9"
              value={address}
              onChange={handleInputChange}
              aria-invalid={error ? true : undefined}
            />
            {error && (
              <p className="absolute left-0 top-full mt-1 max-w-full truncate text-xs text-destructive">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-10 w-10 shrink-0 p-0 sm:h-9 sm:w-auto sm:px-3"
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
