import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js';
import { connection, LAMPORTS_PER_SOL, validateSolanaAddress } from '../solana';
import { withRetry, DEFAULT_RETRY_OPTIONS } from '../retry';
import { RpcErrorType } from '../errors';

export const DEFAULT_TRANSACTION_LIMIT = 20;

export type BalanceResult =
  | { success: true; balance: number; address: string }
  | { success: false; error: string; errorType: RpcErrorType; address: string; retryable: boolean };

export async function getSolBalance(address: string): Promise<BalanceResult> {
  const validation = validateSolanaAddress(address);

  if (validation.valid === false) {
    return {
      success: false,
      error: validation.error,
      errorType: 'INVALID_RESPONSE',
      address,
      retryable: false,
    };
  }

  const result = await withRetry(
    () => connection.getBalance(validation.publicKey),
    DEFAULT_RETRY_OPTIONS
  );

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      errorType: result.error.type,
      address,
      retryable: result.error.retryable,
    };
  }

  const balance = result.data / LAMPORTS_PER_SOL;
  return { success: true, balance, address };
}

export async function getSolBalanceFromPublicKey(publicKey: PublicKey): Promise<BalanceResult> {
  const address = publicKey.toBase58();

  const result = await withRetry(
    () => connection.getBalance(publicKey),
    DEFAULT_RETRY_OPTIONS
  );

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      errorType: result.error.type,
      address,
      retryable: result.error.retryable,
    };
  }

  const balance = result.data / LAMPORTS_PER_SOL;
  return { success: true, balance, address };
}

export type TransactionSignaturesResult =
  | { success: true; signatures: ConfirmedSignatureInfo[]; address: string }
  | { success: false; error: string; errorType: RpcErrorType; address: string; retryable: boolean };

export async function getRecentTransactionSignatures(
  address: string,
  limit: number = DEFAULT_TRANSACTION_LIMIT
): Promise<TransactionSignaturesResult> {
  const validation = validateSolanaAddress(address);

  if (validation.valid === false) {
    return {
      success: false,
      error: validation.error,
      errorType: 'INVALID_RESPONSE',
      address,
      retryable: false,
    };
  }

  const result = await withRetry(
    () => connection.getSignaturesForAddress(validation.publicKey, { limit }),
    DEFAULT_RETRY_OPTIONS
  );

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      errorType: result.error.type,
      address,
      retryable: result.error.retryable,
    };
  }

  return { success: true, signatures: result.data, address };
}

export async function getRecentTransactionSignaturesFromPublicKey(
  publicKey: PublicKey,
  limit: number = DEFAULT_TRANSACTION_LIMIT
): Promise<TransactionSignaturesResult> {
  const address = publicKey.toBase58();

  const result = await withRetry(
    () => connection.getSignaturesForAddress(publicKey, { limit }),
    DEFAULT_RETRY_OPTIONS
  );

  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      errorType: result.error.type,
      address,
      retryable: result.error.retryable,
    };
  }

  return { success: true, signatures: result.data, address };
}
