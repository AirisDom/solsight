import { WalletProfileCard } from "./WalletProfileCard";
import { getSolBalance } from "@/lib/services/wallet";

interface WalletProfileCardLoaderProps {
  address: string;
}

export async function WalletProfileCardLoader({ address }: WalletProfileCardLoaderProps) {
  const result = await getSolBalance(address);
  const solBalance = result.success ? result.balance : 0;

  return <WalletProfileCard address={address} solBalance={solBalance} />;
}
