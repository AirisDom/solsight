import { ActivityTimeline } from "./ActivityTimeline";
import { getRecentTransactionSignatures } from "@/lib/services/wallet";
import { parseTransactionSignaturesBatch } from "@/lib/services/parser";

interface ActivityTimelineLoaderProps {
  address: string;
}

export async function ActivityTimelineLoader({ address }: ActivityTimelineLoaderProps) {
  const signaturesResult = await getRecentTransactionSignatures(address);

  if (!signaturesResult.success) {
    return <ActivityTimeline activities={[]} />;
  }

  const activities = await parseTransactionSignaturesBatch(
    signaturesResult.signatures,
    address
  );

  return <ActivityTimeline activities={activities} />;
}
