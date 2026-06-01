import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">SolSight</h1>
        </div>

        <p className="text-center text-muted-foreground">
          A minimalist Solana wallet analyzer
        </p>

        <div className="flex w-full gap-2">
          <Input
            placeholder="Enter Solana Address (e.g., HN7c...)"
            className="flex-1"
          />
          <Button>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="flex gap-4">
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </main>
    </div>
  );
}
