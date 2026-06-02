export type TransactionType = 'SWAP' | 'TRANSFER' | 'MINT' | 'UNKNOWN';

export type TokenDirection = 'IN' | 'OUT' | 'NEUTRAL';

export interface ParsedActivity {
  signature: string;
  timestamp: Date;
  type: TransactionType;
  direction: TokenDirection;
  summary: string;
  fee: number;
  successful: boolean;
}

export interface WalletProfile {
  address: string;
  solBalance: number;
  recentActivities: ParsedActivity[];
}
