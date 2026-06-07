import { Inbox } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import type { ParsedActivity } from "@/types";

interface ActivityTimelineProps {
  activities: ParsedActivity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center sm:p-12">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12">
          <Inbox className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold sm:text-lg">No Activity Found</h3>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
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
