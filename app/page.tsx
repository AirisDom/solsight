import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-xl flex-col items-center">
        <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
          SolSight
        </h1>

        <p className="mb-10 text-center text-lg text-muted-foreground">
          Solana wallet analyzer
        </p>

        <div className="flex w-full max-w-lg gap-2">
          <Input
            type="text"
            placeholder="Enter Solana Address (e.g., HN7c...)"
            className="h-12 flex-1 text-base"
          />
          <Button size="lg" className="h-12 px-6">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </main>
  );
}
