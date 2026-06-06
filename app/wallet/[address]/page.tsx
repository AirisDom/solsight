import { Navbar } from "@/components/Navbar";
import { WalletProfileCard } from "@/components/WalletProfileCard";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { getSolBalance, getRecentTransactionSignatures } from "@/lib/services/wallet";
import { parseTransactionSignaturesBatch } from "@/lib/services/parser";
import type { ParsedActivity } from "@/types";

interface WalletPageProps {
  params: Promise<{ address: string }>;
}

async function fetchWalletData(address: string): Promise<{
  solBalance: number;
  activities: ParsedActivity[];
  error?: string;
}> {
  const [balanceResult, signaturesResult] = await Promise.all([
    getSolBalance(address),
    getRecentTransactionSignatures(address),
  ]);

  if (!balanceResult.success) {
    return { solBalance: 0, activities: [], error: balanceResult.error };
  }

  if (!signaturesResult.success) {
    return { solBalance: balanceResult.balance, activities: [], error: signaturesResult.error };
  }

  const activities = await parseTransactionSignaturesBatch(
    signaturesResult.signatures,
    address
  );

  return { solBalance: balanceResult.balance, activities };
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;
  const { solBalance, activities, error } = await fetchWalletData(address);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
              <p className="text-sm font-medium">Error loading wallet data</p>
              <p className="mt-1 text-sm opacity-80">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <WalletProfileCard address={address} solBalance={solBalance} />
            </div>

            <div className="md:col-span-2">
              <ActivityTimeline activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
