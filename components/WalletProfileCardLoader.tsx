import { WalletProfileCard } from "./WalletProfileCard";
import { NetworkError } from "./NetworkError";
import { getSolBalance } from "@/lib/services/wallet";

interface WalletProfileCardLoaderProps {
  address: string;
}

export async function WalletProfileCardLoader({ address }: WalletProfileCardLoaderProps) {
  const result = await getSolBalance(address);

  if (!result.success) {
    return <NetworkError message={result.error} />;
  }

  return <WalletProfileCard address={address} solBalance={result.balance} />;
}
