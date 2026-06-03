import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

export const SOLANA_NETWORK = 'mainnet-beta' as const;
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);
export const LAMPORTS_PER_SOL = 1_000_000_000;

export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

export type AddressValidationResult =
  | { valid: true; address: string; publicKey: PublicKey }
  | { valid: false; address: string; error: string };

export function validateSolanaAddress(input: string): AddressValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, address: trimmed, error: 'Address cannot be empty' };
  }

  try {
    const publicKey = new PublicKey(trimmed);
    if (!PublicKey.isOnCurve(publicKey.toBytes())) {
      return { valid: false, address: trimmed, error: 'Address is not on the ed25519 curve' };
    }
    return { valid: true, address: trimmed, publicKey };
  } catch {
    return { valid: false, address: trimmed, error: 'Invalid base58 address' };
  }
}
