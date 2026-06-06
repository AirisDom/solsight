import {
  ParsedTransactionWithMeta,
  ConfirmedSignatureInfo,
} from '@solana/web3.js';
import { ParsedActivity, TransactionType, TokenDirection } from '@/types';
import { connection, LAMPORTS_PER_SOL } from '../solana';

export function parseSignatureInfo(
  signatureInfo: ConfirmedSignatureInfo
): ParsedActivity {
  const timestamp = signatureInfo.blockTime
    ? new Date(signatureInfo.blockTime * 1000)
    : new Date();

  return {
    signature: signatureInfo.signature,
    timestamp,
    type: 'UNKNOWN' as TransactionType,
    direction: 'NEUTRAL' as TokenDirection,
    summary: signatureInfo.memo || 'Transaction',
    fee: 0,
    successful: signatureInfo.err === null,
  };
}

export async function fetchAndParseTransaction(
  signature: string,
  walletAddress: string
): Promise<ParsedActivity | null> {
  try {
    const transaction = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) {
      return null;
    }

    return parseTransaction(transaction, walletAddress);
  } catch {
    return null;
  }
}

export function parseTransaction(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): ParsedActivity {
  const timestamp = transaction.blockTime
    ? new Date(transaction.blockTime * 1000)
    : new Date();

  const signature = transaction.transaction.signatures[0] || '';
  const fee = transaction.meta?.fee || 0;
  const successful = transaction.meta?.err === null;

  const { type, direction, summary } = analyzeTransaction(
    transaction,
    walletAddress
  );

  return {
    signature,
    timestamp,
    type,
    direction,
    summary,
    fee,
    successful,
  };
}

interface TransactionAnalysis {
  type: TransactionType;
  direction: TokenDirection;
  summary: string;
}

function analyzeTransaction(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): TransactionAnalysis {
  const instructions = transaction.transaction.message.instructions;

  for (const instruction of instructions) {
    if ('parsed' in instruction && instruction.program === 'system') {
      const result = analyzeSystemInstruction(instruction.parsed, walletAddress);
      if (result) return result;
    }
  }

  const balanceChange = getBalanceChange(transaction, walletAddress);
  if (balanceChange !== null && balanceChange !== 0) {
    return createBalanceChangeSummary(balanceChange);
  }

  return {
    type: 'UNKNOWN',
    direction: 'NEUTRAL',
    summary: 'Transaction',
  };
}

interface SystemParsedInstruction {
  type: string;
  info: {
    source?: string;
    destination?: string;
    lamports?: number;
  };
}

function analyzeSystemInstruction(
  parsed: SystemParsedInstruction,
  walletAddress: string
): TransactionAnalysis | null {
  if (parsed.type === 'transfer') {
    const { source, destination, lamports } = parsed.info;
    const amount = (lamports || 0) / LAMPORTS_PER_SOL;
    const formattedAmount = formatSolAmount(amount);

    if (destination === walletAddress) {
      return {
        type: 'TRANSFER',
        direction: 'IN',
        summary: `Received ${formattedAmount} SOL`,
      };
    }

    if (source === walletAddress) {
      return {
        type: 'TRANSFER',
        direction: 'OUT',
        summary: `Sent ${formattedAmount} SOL`,
      };
    }

    return {
      type: 'TRANSFER',
      direction: 'NEUTRAL',
      summary: `Transfer ${formattedAmount} SOL`,
    };
  }

  if (parsed.type === 'createAccount' || parsed.type === 'createAccountWithSeed') {
    return {
      type: 'UNKNOWN',
      direction: 'OUT',
      summary: 'Created account',
    };
  }

  return null;
}

function getBalanceChange(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): number | null {
  const meta = transaction.meta;
  if (!meta) return null;

  const accountKeys = transaction.transaction.message.accountKeys;
  const accountIndex = accountKeys.findIndex((key) => {
    const pubkey = typeof key === 'string' ? key : key.pubkey.toBase58();
    return pubkey === walletAddress;
  });

  if (accountIndex === -1) return null;

  const preBalance = meta.preBalances[accountIndex];
  const postBalance = meta.postBalances[accountIndex];

  if (preBalance === undefined || postBalance === undefined) return null;

  return (postBalance - preBalance) / LAMPORTS_PER_SOL;
}

function createBalanceChangeSummary(balanceChange: number): TransactionAnalysis {
  const formattedAmount = formatSolAmount(Math.abs(balanceChange));

  if (balanceChange > 0) {
    return {
      type: 'TRANSFER',
      direction: 'IN',
      summary: `Received ${formattedAmount} SOL`,
    };
  }

  return {
    type: 'TRANSFER',
    direction: 'OUT',
    summary: `Sent ${formattedAmount} SOL`,
  };
}

function formatSolAmount(amount: number): string {
  if (amount >= 1) {
    return amount.toFixed(4).replace(/\.?0+$/, '');
  }
  if (amount >= 0.0001) {
    return amount.toFixed(6).replace(/\.?0+$/, '');
  }
  return amount.toExponential(2);
}

export async function parseTransactionSignatures(
  signatures: ConfirmedSignatureInfo[],
  walletAddress: string
): Promise<ParsedActivity[]> {
  const activities: ParsedActivity[] = [];

  for (const sigInfo of signatures) {
    const activity = await fetchAndParseTransaction(
      sigInfo.signature,
      walletAddress
    );

    if (activity) {
      activities.push(activity);
    } else {
      activities.push(parseSignatureInfo(sigInfo));
    }
  }

  return activities;
}

export async function parseTransactionSignaturesBatch(
  signatures: ConfirmedSignatureInfo[],
  walletAddress: string,
  batchSize: number = 10
): Promise<ParsedActivity[]> {
  const activities: ParsedActivity[] = [];

  for (let i = 0; i < signatures.length; i += batchSize) {
    const batch = signatures.slice(i, i + batchSize);
    const batchPromises = batch.map(async (sigInfo) => {
      const activity = await fetchAndParseTransaction(
        sigInfo.signature,
        walletAddress
      );
      return activity || parseSignatureInfo(sigInfo);
    });

    const batchResults = await Promise.all(batchPromises);
    activities.push(...batchResults);
  }

  return activities;
}
