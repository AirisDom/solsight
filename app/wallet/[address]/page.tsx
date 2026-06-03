interface WalletPageProps {
  params: Promise<{ address: string }>;
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;

  return (
    <main className="flex flex-1 flex-col px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="rounded-lg border bg-card p-6 text-card-foreground">
              <h2 className="text-lg font-semibold">Profile Summary</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Wallet: {address.slice(0, 4)}...{address.slice(-4)}
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-lg border bg-card p-6 text-card-foreground">
              <h2 className="text-lg font-semibold">Activity Timeline</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Recent transactions will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
