"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { validateSolanaAddress } from "@/lib/solana";

export default function Home() {
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
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-xl flex-col items-center">
        <h1 className="animate-gradient mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-6xl md:text-7xl">
          SolSight
        </h1>

        <p className="mb-8 text-center text-base text-muted-foreground sm:mb-10 sm:text-lg">
          Solana wallet analyzer
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2">
            <Input
              type="text"
              placeholder="Enter Solana Address (e.g., HN7c...)"
              className="h-12 flex-1 text-base transition-shadow duration-200 focus:shadow-lg focus:shadow-purple-500/10"
              value={address}
              onChange={handleInputChange}
              aria-invalid={error ? true : undefined}
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full px-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] sm:w-auto"
              disabled={isLoading || !isAddressValid}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </div>
          <div className="h-6 mt-2">
            {error && (
              <p className="animate-in fade-in slide-in-from-top-1 text-sm text-destructive duration-200">{error}</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
