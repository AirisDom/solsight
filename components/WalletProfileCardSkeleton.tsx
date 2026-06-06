export function WalletProfileCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />

      <div className="mt-2 flex items-center gap-2">
        <div className="h-7 w-28 animate-pulse rounded bg-muted" />
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
      </div>

      <div className="mt-6">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="mt-2 flex items-baseline gap-2">
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
          <div className="h-6 w-10 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
