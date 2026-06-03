interface WalletPageProps {
  params: Promise<{ address: string }>;
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { address } = await params;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Analyzing wallet: {address}
        </p>
      </div>
    </main>
  );
}
