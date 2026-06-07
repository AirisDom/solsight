import { Suspense } from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { WalletProfileCardLoader } from "@/components/WalletProfileCardLoader";
import { ActivityTimelineLoader } from "@/components/ActivityTimelineLoader";
import { WalletProfileCardSkeleton } from "@/components/WalletProfileCardSkeleton";
import { ActivityTimelineSkeleton } from "@/components/ActivityTimelineSkeleton";
import { InvalidAddressError } from "@/components/InvalidAddressError";
import { validateSolanaAddress } from "@/lib/solana";

interface WalletPageProps {
  params: Promise<{ address: string }>;
}

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export async function generateMetadata({ params }: WalletPageProps): Promise<Metadata> {
  const { address } = await params;
  const decodedAddress = decodeURIComponent(address);
  const validation = validateSolanaAddress(decodedAddress);

  if (!validation.valid) {
    return {
      title: "Invalid Address",
      description: "The provided Solana address is invalid.",
    };
  }

  const truncated = truncateAddress(validation.address);

  return {
    title: `Wallet ${truncated}`,
    description: `View transaction history and activity for Solana wallet ${validation.address}`,
    openGraph: {
      title: `Wallet ${truncated} | SolSight`,
      description: `View transaction history and activity for Solana wallet ${validation.address}`,
    },
    twitter: {
      card: "summary",
      title: `Wallet ${truncated} | SolSight`,
      description: `View transaction history and activity for Solana wallet ${validation.address}`,
    },
  };
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;
  const decodedAddress = decodeURIComponent(address);

  const validation = validateSolanaAddress(decodedAddress);

  if (!validation.valid) {
    return (
      <>
        <Navbar />
        <InvalidAddressError
          address={decodedAddress}
          errorMessage={validation.error}
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-6 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Suspense fallback={<WalletProfileCardSkeleton />}>
                <WalletProfileCardLoader address={validation.address} />
              </Suspense>
            </div>

            <div className="lg:col-span-2">
              <Suspense fallback={<ActivityTimelineSkeleton />}>
                <ActivityTimelineLoader address={validation.address} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
