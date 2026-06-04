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

function getTypeIcon(type: TransactionType, direction: TokenDirection) {
  switch (type) {
    case "SWAP":
      return ArrowLeftRight;
    case "TRANSFER":
      return direction === "IN" ? ArrowDown : ArrowUp;
    case "MINT":
      return Coins;
    default:
      return HelpCircle;
  }
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
  const Icon = getTypeIcon(type, direction);
  const iconStyles = getDirectionStyles(direction, successful);
  const solscanUrl = `https://solscan.io/tx/${signature}`;

  return (
    <div
      className={`flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50 ${
        !successful ? "opacity-60" : ""
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconStyles}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{summary}</p>
          {!successful && (
            <span className="shrink-0 rounded bg-destructive/20 px-1.5 py-0.5 text-xs font-medium text-destructive">
              Failed
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {formatTimestamp(timestamp)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 text-right">
        <div>
          <p className="text-xs text-muted-foreground">Fee</p>
          <p className="text-sm font-medium">{formatFee(fee)}</p>
        </div>
        <a
          href={solscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="View on Solscan"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
