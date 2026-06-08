import {
  ArrowDown,
  ArrowUp,
  ArrowLeftRight,
  Coins,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import type { ParsedActivity, TransactionType, TokenDirection } from "@/types";

interface ActivityCardProps {
  activity: ParsedActivity;
}

interface TypeIconProps {
  type: TransactionType;
  direction: TokenDirection;
}

function TypeIcon({ type, direction }: TypeIconProps) {
  if (type === "SWAP") return <ArrowLeftRight className="h-5 w-5" />;
  if (type === "TRANSFER") {
    return direction === "IN" ? <ArrowDown className="h-5 w-5" /> : <ArrowUp className="h-5 w-5" />;
  }
  if (type === "MINT") return <Coins className="h-5 w-5" />;
  return <HelpCircle className="h-5 w-5" />;
}

function getDirectionStyles(direction: TokenDirection, successful: boolean) {
  if (!successful) {
    return "bg-muted text-muted-foreground";
  }
  switch (direction) {
    case "IN":
      return "bg-green-500/20 text-green-600 dark:text-green-400";
    case "OUT":
      return "bg-red-500/20 text-red-600 dark:text-red-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatFee(lamports: number) {
  const sol = lamports / 1_000_000_000;
  if (sol < 0.0001) {
    return `${lamports.toLocaleString()} lamports`;
  }
  return `${sol.toFixed(6)} SOL`;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { signature, timestamp, type, direction, summary, fee, successful } = activity;
  const iconStyles = getDirectionStyles(direction, successful);
  const solscanUrl = `https://solscan.io/tx/${signature}`;

  const cardStyles = successful
    ? "border bg-card hover:bg-accent/50 hover:shadow-md hover:border-accent"
    : "border-destructive/30 bg-destructive/5 opacity-50 hover:opacity-70";

  return (
    <div
      className={`relative flex flex-col gap-3 rounded-lg p-3 transition-all duration-200 sm:flex-row sm:items-center sm:gap-4 sm:p-4 ${cardStyles}`}
    >
      <div className="flex items-center gap-3 sm:contents">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconStyles}`}>
          <TypeIcon type={type} direction={direction} />
        </div>

        <div className="min-w-0 flex-1 sm:flex-1">
          <div className="flex items-center gap-2">
            <p className={`truncate text-sm font-medium sm:text-base ${!successful ? "line-through decoration-destructive/50" : ""}`}>
              {summary}
            </p>
            {!successful && (
              <span className="shrink-0 rounded-full border border-destructive/50 bg-destructive/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-destructive">
                Failed
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {formatTimestamp(timestamp)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t pt-3 sm:justify-end sm:border-0 sm:pt-0 sm:text-right">
        <div>
          <p className="text-xs text-muted-foreground">Fee</p>
          <p className="text-xs font-medium sm:text-sm">{formatFee(fee)}</p>
        </div>
        <a
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-accent hover:text-foreground sm:h-8 sm:w-8"
          aria-label="View on Solscan"
        >
          <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
        </a>
      </div>
    </div>
  );
}
