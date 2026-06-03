import { validateSolanaAddress } from './solana';

const VALID_ADDRESSES = [
  'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  'So11111111111111111111111111111111111111112',
  '11111111111111111111111111111111',
];

const INVALID_ADDRESSES = [
  { input: '', expectedError: 'Address cannot be empty' },
  { input: '   ', expectedError: 'Address cannot be empty' },
  { input: 'invalid', expectedError: 'Invalid base58 address' },
  { input: '0x1234567890abcdef', expectedError: 'Invalid base58 address' },
  { input: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH!', expectedError: 'Invalid base58 address' },
  { input: 'abc', expectedError: 'Invalid base58 address' },
  { input: 'O0Il', expectedError: 'Invalid base58 address' },
];

function runTests() {
  console.log('=== Solana Address Validation Tests ===\n');

  let passed = 0;
  let failed = 0;

  console.log('Testing valid addresses:');
  for (const address of VALID_ADDRESSES) {
    const result = validateSolanaAddress(address);
    if (result.valid) {
      console.log(`  ✓ "${address}" is valid`);
      passed++;
    } else {
      console.log(`  ✗ "${address}" should be valid but got: ${result.error}`);
      failed++;
    }
  }

  console.log('\nTesting invalid addresses:');
  for (const { input, expectedError } of INVALID_ADDRESSES) {
    const result = validateSolanaAddress(input);
    if (!result.valid && result.error === expectedError) {
      console.log(`  ✓ "${input || '(empty)'}" correctly rejected: ${result.error}`);
      passed++;
    } else if (result.valid) {
      console.log(`  ✗ "${input || '(empty)'}" should be invalid but was accepted`);
      failed++;
    } else {
      console.log(`  ✗ "${input || '(empty)'}" wrong error. Expected: "${expectedError}", got: "${result.error}"`);
      failed++;
    }
  }

  console.log('\nTesting whitespace trimming:');
  const paddedAddress = '  HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH  ';
  const paddedResult = validateSolanaAddress(paddedAddress);
  if (paddedResult.valid && paddedResult.address === paddedAddress.trim()) {
    console.log(`  ✓ Whitespace correctly trimmed`);
    passed++;
  } else {
    console.log(`  ✗ Whitespace trimming failed`);
    failed++;
  }

  console.log('\nTesting typed result structure:');
  const validResult = validateSolanaAddress('HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH');
  if (validResult.valid && 'publicKey' in validResult && validResult.publicKey) {
    console.log(`  ✓ Valid result includes publicKey property`);
    passed++;
  } else {
    console.log(`  ✗ Valid result missing publicKey property`);
    failed++;
  }

  const invalidResult = validateSolanaAddress('invalid');
  if (!invalidResult.valid && 'error' in invalidResult && invalidResult.error) {
    console.log(`  ✓ Invalid result includes error property`);
    passed++;
  } else {
    console.log(`  ✗ Invalid result missing error property`);
    failed++;
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
