import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js';
import { connection, LAMPORTS_PER_SOL, validateSolanaAddress } from '../solana';

export const DEFAULT_TRANSACTION_LIMIT = 20;

export type BalanceResult =
  | { success: true; balance: number; address: string }
  | { success: false; error: string; address: string };

export async function getSolBalance(address: string): Promise<BalanceResult> {
  const validation = validateSolanaAddress(address);

  if (validation.valid === false) {
    return { success: false, error: validation.error, address };
  }

  try {
    const lamports = await connection.getBalance(validation.publicKey);
    const balance = lamports / LAMPORTS_PER_SOL;

    return { success: true, balance, address };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch balance';
    return { success: false, error: message, address };
  }
}

export async function getSolBalanceFromPublicKey(publicKey: PublicKey): Promise<BalanceResult> {
  const address = publicKey.toBase58();

  try {
    const lamports = await connection.getBalance(publicKey);
    const balance = lamports / LAMPORTS_PER_SOL;

    return { success: true, balance, address };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch balance';
    return { success: false, error: message, address };
  }
}

export type TransactionSignaturesResult =
  | { success: true; signatures: ConfirmedSignatureInfo[]; address: string }
  | { success: false; error: string; address: string };

export async function getRecentTransactionSignatures(
  address: string,
  limit: number = DEFAULT_TRANSACTION_LIMIT
): Promise<TransactionSignaturesResult> {
  const validation = validateSolanaAddress(address);

  if (validation.valid === false) {
    return { success: false, error: validation.error, address };
  }

  try {
    const signatures = await connection.getSignaturesForAddress(
      validation.publicKey,
      { limit }
    );

    return { success: true, signatures, address };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transaction signatures';
    return { success: false, error: message, address };
  }
}

export async function getRecentTransactionSignaturesFromPublicKey(
  publicKey: PublicKey,
  limit: number = DEFAULT_TRANSACTION_LIMIT
): Promise<TransactionSignaturesResult> {
  const address = publicKey.toBase58();

  try {
    const signatures = await connection.getSignaturesForAddress(
      publicKey,
      { limit }
    );

    return { success: true, signatures, address };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transaction signatures';
    return { success: false, error: message, address };
  }
}
