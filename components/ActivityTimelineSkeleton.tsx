function ActivityCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <div className="flex items-center gap-3 sm:contents">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-muted sm:h-5 sm:w-48" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-muted sm:h-4 sm:w-24" />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t pt-3 sm:justify-end sm:border-0 sm:pt-0">
        <div>
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted sm:h-4" />
        </div>
        <div className="h-10 w-10 animate-pulse rounded bg-muted sm:h-8 sm:w-8" />
      </div>
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </div>
  );
}
