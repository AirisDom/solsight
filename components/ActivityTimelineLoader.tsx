import { ActivityTimeline } from "./ActivityTimeline";
import { NetworkError } from "./NetworkError";
import { getRecentTransactionSignatures } from "@/lib/services/wallet";
import { parseTransactionSignaturesBatch } from "@/lib/services/parser";

interface ActivityTimelineLoaderProps {
  address: string;
}

export async function ActivityTimelineLoader({ address }: ActivityTimelineLoaderProps) {
  const signaturesResult = await getRecentTransactionSignatures(address);

  if (!signaturesResult.success) {
    return <NetworkError message={signaturesResult.error} />;
  }

  const activities = await parseTransactionSignaturesBatch(
    signaturesResult.signatures,
    address
  );

  return <ActivityTimeline activities={activities} />;
}
