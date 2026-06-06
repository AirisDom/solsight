import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { WalletProfileCardLoader } from "@/components/WalletProfileCardLoader";
import { ActivityTimelineLoader } from "@/components/ActivityTimelineLoader";
import { WalletProfileCardSkeleton } from "@/components/WalletProfileCardSkeleton";
import { ActivityTimelineSkeleton } from "@/components/ActivityTimelineSkeleton";

interface WalletPageProps {
  params: Promise<{ address: string }>;
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Suspense fallback={<WalletProfileCardSkeleton />}>
                <WalletProfileCardLoader address={address} />
              </Suspense>
            </div>

            <div className="md:col-span-2">
              <Suspense fallback={<ActivityTimelineSkeleton />}>
                <ActivityTimelineLoader address={address} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
