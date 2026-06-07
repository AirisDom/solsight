import { Suspense } from "react";
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
