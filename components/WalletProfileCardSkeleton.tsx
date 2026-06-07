export function WalletProfileCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-white/5">
      <div className="h-3 w-14 animate-pulse rounded bg-muted sm:h-4 sm:w-16" />

      <div className="mt-2 flex items-center gap-2">
        <div className="h-6 w-24 animate-pulse rounded bg-muted sm:h-7 sm:w-28" />
        <div className="h-10 w-10 animate-pulse rounded bg-muted sm:h-8 sm:w-8" />
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="h-3 w-14 animate-pulse rounded bg-muted sm:h-4 sm:w-16" />
        <div className="mt-2 flex items-baseline gap-2">
          <div className="h-8 w-28 animate-pulse rounded bg-muted sm:h-9 sm:w-32" />
          <div className="h-5 w-9 animate-pulse rounded bg-muted sm:h-6 sm:w-10" />
        </div>
      </div>
    </div>
  );
}
