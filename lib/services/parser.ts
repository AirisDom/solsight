import {
  ParsedTransactionWithMeta,
  ConfirmedSignatureInfo,
} from '@solana/web3.js';
import { ParsedActivity, TransactionType, TokenDirection } from '@/types';
import { connection, LAMPORTS_PER_SOL } from '../solana';
import { withRetry } from '../retry';

const DEX_PROGRAM_IDS: Record<string, string> = {
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter',
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': 'Jupiter',
  'JUP3c2Uh3WA4Ng34tw6kPd2G4C5BB21Xo36Je1s32Ph': 'Jupiter',
  'JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo': 'Jupiter',
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium',
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK': 'Raydium',
  'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C': 'Raydium',
  'RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr': 'Raydium',
  '27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv': 'Raydium',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Orca',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca',
};

const NFT_PROGRAM_IDS = new Set([
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  'p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98',
  'CMZYPASGWeTz7RNGHaRJfCq2XQ5pYK6nDvVQxzkH51zb',
  'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY',
  'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR',
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
]);

interface TokenBalanceChange {
  mint: string;
  symbol: string;
  amount: number;
  direction: 'IN' | 'OUT';
}

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
    summary: signatureInfo.memo || 'Unknown transaction',
    fee: 0,
    successful: signatureInfo.err === null,
  };
}

export async function fetchAndParseTransaction(
  signature: string,
  walletAddress: string
): Promise<ParsedActivity | null> {
  const result = await withRetry(
    () => connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    }),
    { maxRetries: 2, initialDelayMs: 300 }
  );

  if (!result.success || !result.data) {
    return null;
  }

  return parseTransaction(result.data, walletAddress);
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
  const swapResult = analyzeSwapTransaction(transaction, walletAddress);
  if (swapResult) return swapResult;

  const mintResult = analyzeMintTransaction(transaction, walletAddress);
  if (mintResult) return mintResult;

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
    summary: 'Unknown transaction',
  };
}

function isSwapTransaction(transaction: ParsedTransactionWithMeta): string | null {
  const instructions = transaction.transaction.message.instructions;

  for (const instruction of instructions) {
    const programId = 'programId' in instruction
      ? instruction.programId.toBase58()
      : '';

    if (DEX_PROGRAM_IDS[programId]) {
      return DEX_PROGRAM_IDS[programId];
    }
  }

  const innerInstructions = transaction.meta?.innerInstructions || [];
  for (const innerGroup of innerInstructions) {
    for (const inner of innerGroup.instructions) {
      const programId = 'programId' in inner
        ? inner.programId.toBase58()
        : '';

      if (DEX_PROGRAM_IDS[programId]) {
        return DEX_PROGRAM_IDS[programId];
      }
    }
  }

  return null;
}

const KNOWN_TOKEN_MINTS: Record<string, string> = {
  'So11111111111111111111111111111111111111112': 'SOL',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'JUP',
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': 'ETH',
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'stSOL',
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 'mSOL',
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1': 'bSOL',
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 'PYTH',
  'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk': 'WEN',
  'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof': 'RNDR',
};

function getTokenSymbol(mint: string): string {
  return KNOWN_TOKEN_MINTS[mint] || truncateMint(mint);
}

function truncateMint(mint: string): string {
  if (mint.length <= 8) return mint;
  return `${mint.slice(0, 4)}...${mint.slice(-4)}`;
}

function getTokenBalanceChanges(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): TokenBalanceChange[] {
  const meta = transaction.meta;
  if (!meta) return [];

  const changes: TokenBalanceChange[] = [];
  const preTokenBalances = meta.preTokenBalances || [];
  const postTokenBalances = meta.postTokenBalances || [];

  const accountKeys = transaction.transaction.message.accountKeys;
  const walletIndices = new Set<number>();

  accountKeys.forEach((key, index) => {
    const pubkey = typeof key === 'string' ? key : key.pubkey.toBase58();
    if (pubkey === walletAddress) {
      walletIndices.add(index);
    }
  });

  const preBalanceMap = new Map<string, { amount: number; owner: string }>();
  for (const balance of preTokenBalances) {
    const owner = balance.owner || '';
    if (owner === walletAddress || walletIndices.has(balance.accountIndex)) {
      const key = `${balance.mint}-${balance.accountIndex}`;
      preBalanceMap.set(key, {
        amount: Number(balance.uiTokenAmount.uiAmount || 0),
        owner,
      });
    }
  }

  for (const balance of postTokenBalances) {
    const owner = balance.owner || '';
    if (owner !== walletAddress && !walletIndices.has(balance.accountIndex)) {
      continue;
    }

    const key = `${balance.mint}-${balance.accountIndex}`;
    const preBalance = preBalanceMap.get(key);
    const preAmount = preBalance?.amount || 0;
    const postAmount = Number(balance.uiTokenAmount.uiAmount || 0);
    const diff = postAmount - preAmount;

    if (Math.abs(diff) > 0.000001) {
      changes.push({
        mint: balance.mint,
        symbol: getTokenSymbol(balance.mint),
        amount: Math.abs(diff),
        direction: diff > 0 ? 'IN' : 'OUT',
      });
    }

    preBalanceMap.delete(key);
  }

  for (const [key, preBalance] of preBalanceMap) {
    const mint = key.split('-')[0];
    if (preBalance.amount > 0.000001) {
      changes.push({
        mint,
        symbol: getTokenSymbol(mint),
        amount: preBalance.amount,
        direction: 'OUT',
      });
    }
  }

  return changes;
}

function analyzeSwapTransaction(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): TransactionAnalysis | null {
  const dexName = isSwapTransaction(transaction);
  if (!dexName) return null;

  const tokenChanges = getTokenBalanceChanges(transaction, walletAddress);
  const solChange = getBalanceChange(transaction, walletAddress);

  const fee = transaction.meta?.fee || 0;
  const adjustedSolChange = solChange !== null
    ? solChange + (fee / LAMPORTS_PER_SOL)
    : null;

  const tokensIn = tokenChanges.filter(t => t.direction === 'IN');
  const tokensOut = tokenChanges.filter(t => t.direction === 'OUT');

  if (adjustedSolChange !== null && Math.abs(adjustedSolChange) > 0.000001) {
    if (adjustedSolChange > 0) {
      tokensIn.push({
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        amount: adjustedSolChange,
        direction: 'IN',
      });
    } else {
      tokensOut.push({
        mint: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        amount: Math.abs(adjustedSolChange),
        direction: 'OUT',
      });
    }
  }

  if (tokensIn.length === 0 && tokensOut.length === 0) {
    return {
      type: 'SWAP',
      direction: 'NEUTRAL',
      summary: `Swap via ${dexName}`,
    };
  }

  if (tokensIn.length > 0 && tokensOut.length > 0) {
    const tokenIn = tokensIn[0];
    const tokenOut = tokensOut[0];
    return {
      type: 'SWAP',
      direction: 'NEUTRAL',
      summary: `Swapped ${formatTokenAmount(tokenOut.amount)} ${tokenOut.symbol} for ${formatTokenAmount(tokenIn.amount)} ${tokenIn.symbol}`,
    };
  }

  if (tokensIn.length > 0) {
    const tokenIn = tokensIn[0];
    return {
      type: 'SWAP',
      direction: 'IN',
      summary: `Received ${formatTokenAmount(tokenIn.amount)} ${tokenIn.symbol} from swap`,
    };
  }

  if (tokensOut.length > 0) {
    const tokenOut = tokensOut[0];
    return {
      type: 'SWAP',
      direction: 'OUT',
      summary: `Swapped ${formatTokenAmount(tokenOut.amount)} ${tokenOut.symbol}`,
    };
  }

  return {
    type: 'SWAP',
    direction: 'NEUTRAL',
    summary: `Swap via ${dexName}`,
  };
}

function hasNftProgramInteraction(transaction: ParsedTransactionWithMeta): boolean {
  const instructions = transaction.transaction.message.instructions;

  for (const instruction of instructions) {
    const programId = 'programId' in instruction
      ? instruction.programId.toBase58()
      : '';
    if (NFT_PROGRAM_IDS.has(programId)) {
      return true;
    }
  }

  const innerInstructions = transaction.meta?.innerInstructions || [];
  for (const innerGroup of innerInstructions) {
    for (const inner of innerGroup.instructions) {
      const programId = 'programId' in inner
        ? inner.programId.toBase58()
        : '';
      if (NFT_PROGRAM_IDS.has(programId)) {
        return true;
      }
    }
  }

  return false;
}

function hasMintToInstruction(transaction: ParsedTransactionWithMeta): boolean {
  const instructions = transaction.transaction.message.instructions;

  for (const instruction of instructions) {
    if ('parsed' in instruction && instruction.program === 'spl-token') {
      const parsed = instruction.parsed as { type?: string };
      if (parsed.type === 'mintTo' || parsed.type === 'mintToChecked') {
        return true;
      }
    }
  }

  const innerInstructions = transaction.meta?.innerInstructions || [];
  for (const innerGroup of innerInstructions) {
    for (const inner of innerGroup.instructions) {
      if ('parsed' in inner && 'program' in inner && inner.program === 'spl-token') {
        const parsed = inner.parsed as { type?: string };
        if (parsed.type === 'mintTo' || parsed.type === 'mintToChecked') {
          return true;
        }
      }
    }
  }

  return false;
}

function analyzeMintTransaction(
  transaction: ParsedTransactionWithMeta,
  walletAddress: string
): TransactionAnalysis | null {
  const hasNftProgram = hasNftProgramInteraction(transaction);
  const hasMintTo = hasMintToInstruction(transaction);

  if (!hasNftProgram && !hasMintTo) {
    return null;
  }

  const tokenChanges = getTokenBalanceChanges(transaction, walletAddress);
  const tokensIn = tokenChanges.filter(t => t.direction === 'IN');

  const isNftMint = hasNftProgram || tokensIn.some(t => t.amount === 1);

  if (isNftMint) {
    return {
      type: 'MINT',
      direction: 'IN',
      summary: 'Minted NFT',
    };
  }

  if (tokensIn.length > 0) {
    const token = tokensIn[0];
    return {
      type: 'MINT',
      direction: 'IN',
      summary: `Minted ${formatTokenAmount(token.amount)} ${token.symbol}`,
    };
  }

  if (hasMintTo) {
    return {
      type: 'MINT',
      direction: 'NEUTRAL',
      summary: 'Minted tokens',
    };
  }

  return null;
}

function formatTokenAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(2)}K`;
  }
  if (amount >= 1) {
    return amount.toFixed(4).replace(/\.?0+$/, '');
  }
  if (amount >= 0.0001) {
    return amount.toFixed(6).replace(/\.?0+$/, '');
  }
  return amount.toExponential(2);
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
