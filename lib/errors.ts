export type RpcErrorType =
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN';

export interface RpcError {
  type: RpcErrorType;
  message: string;
  retryable: boolean;
  originalError?: Error;
}

const RATE_LIMIT_PATTERNS = [
  'rate limit',
  'too many requests',
  '429',
  'throttle',
];

const NETWORK_ERROR_PATTERNS = [
  'network',
  'fetch failed',
  'econnrefused',
  'enotfound',
  'unable to connect',
  'connection refused',
  'dns',
];

const TIMEOUT_PATTERNS = [
  'timeout',
  'timed out',
  'etimedout',
  'deadline exceeded',
];

const SERVER_ERROR_PATTERNS = [
  '500',
  '502',
  '503',
  '504',
  'internal server error',
  'bad gateway',
  'service unavailable',
  'gateway timeout',
];

function matchesPatterns(message: string, patterns: string[]): boolean {
  const lower = message.toLowerCase();
  return patterns.some(pattern => lower.includes(pattern));
}

export function classifyRpcError(error: unknown): RpcError {
  const message = error instanceof Error ? error.message : String(error);

  if (matchesPatterns(message, RATE_LIMIT_PATTERNS)) {
    return {
      type: 'RATE_LIMITED',
      message: 'The Solana network is busy. Please wait a moment and try again.',
      retryable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  if (matchesPatterns(message, TIMEOUT_PATTERNS)) {
    return {
      type: 'TIMEOUT',
      message: 'The request timed out. The network may be congested.',
      retryable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  if (matchesPatterns(message, NETWORK_ERROR_PATTERNS)) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Unable to connect to the Solana network. Check your internet connection.',
      retryable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  if (matchesPatterns(message, SERVER_ERROR_PATTERNS)) {
    return {
      type: 'SERVER_ERROR',
      message: 'The Solana RPC server is experiencing issues. Please try again later.',
      retryable: true,
      originalError: error instanceof Error ? error : undefined,
    };
  }

  return {
    type: 'UNKNOWN',
    message: message || 'An unexpected error occurred',
    retryable: false,
    originalError: error instanceof Error ? error : undefined,
  };
}

export function isRetryableError(error: unknown): boolean {
  const classified = classifyRpcError(error);
  return classified.retryable;
}

export function getUserFriendlyMessage(error: unknown): string {
  const classified = classifyRpcError(error);
  return classified.message;
}
