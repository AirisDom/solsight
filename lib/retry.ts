import { isRetryableError, classifyRpcError, RpcError } from './errors';

export interface RetryOptions {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffMultiplier: 2,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateDelay(
  attempt: number,
  options: RetryOptions
): number {
  const delay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, options.maxDelayMs);
}

export type RetryResult<T> =
  | { success: true; data: T; attempts: number }
  | { success: false; error: RpcError; attempts: number };

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<RetryResult<T>> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: RpcError | null = null;
  let attempts = 0;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    attempts = attempt + 1;

    try {
      const result = await operation();
      return { success: true, data: result, attempts };
    } catch (err) {
      lastError = classifyRpcError(err);

      if (!isRetryableError(err) || attempt === opts.maxRetries) {
        return { success: false, error: lastError, attempts };
      }

      const delay = calculateDelay(attempt, opts);
      await sleep(delay);
    }
  }

  return {
    success: false,
    error: lastError || {
      type: 'UNKNOWN',
      message: 'Unknown error occurred',
      retryable: false,
    },
    attempts,
  };
}

export async function withRetryThrow<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const result = await withRetry(operation, options);

  if (!result.success) {
    const error = new Error(result.error.message);
    (error as Error & { rpcError: RpcError }).rpcError = result.error;
    throw error;
  }

  return result.data;
}
