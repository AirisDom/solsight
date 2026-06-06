function ActivityCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />

      <div className="min-w-0 flex-1">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-24 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <div className="h-3 w-8 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
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
