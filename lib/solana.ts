import { Connection, clusterApiUrl } from '@solana/web3.js';

export const SOLANA_NETWORK = 'mainnet-beta' as const;
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);
export const LAMPORTS_PER_SOL = 1_000_000_000;

export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
