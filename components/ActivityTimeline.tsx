import { Inbox } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import type { ParsedActivity } from "@/types";

interface ActivityTimelineProps {
  activities: ParsedActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Activity Found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          This wallet has no recent transactions to display.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {activities.map((activity) => (
        <ActivityCard key={activity.signature} activity={activity} />
      ))}
    </div>
  );
}
