const {
  parseArgs,
  getNetwork,
  getExplorerUrl,
  validatePrivateKey,
  logDryRun
} = require('../script-utils.cjs');
const { StacksMainnet, StacksTestnet, StacksDevnet } = require('@stacks/network');

describe('parseArgs', () => {
  test('returns default options when no args provided', () => {
    const result = parseArgs([]);
    expect(result.dryRun).toBe(false);
    expect(result.network).toBe('mainnet');
    expect(result.skipConfirm).toBe(false);
  });

  test('parses --dry-run flag', () => {
    const result = parseArgs(['--dry-run']);
    expect(result.dryRun).toBe(true);
  });

  test('parses --network=testnet', () => {
    const result = parseArgs(['--network=testnet']);
    expect(result.network).toBe('testnet');
  });

  test('parses --network=devnet', () => {
    const result = parseArgs(['--network=devnet']);
    expect(result.network).toBe('devnet');
  });

  test('parses --yes flag', () => {
    const result = parseArgs(['--yes']);
    expect(result.skipConfirm).toBe(true);
  });

  test('parses -y flag', () => {
    const result = parseArgs(['-y']);
    expect(result.skipConfirm).toBe(true);
  });

  test('parses multiple flags', () => {
    const result = parseArgs(['--dry-run', '--network=testnet', '-y']);
    expect(result.dryRun).toBe(true);
    expect(result.network).toBe('testnet');
    expect(result.skipConfirm).toBe(true);
  });
});

describe('getNetwork', () => {
  test('returns StacksMainnet instance for mainnet', () => {
    const result = getNetwork('mainnet');
    expect(result).toBeInstanceOf(StacksMainnet);
  });

  test('returns StacksTestnet instance for testnet', () => {
    const result = getNetwork('testnet');
    expect(result).toBeInstanceOf(StacksTestnet);
  });

  test('returns StacksDevnet instance for devnet', () => {
    const result = getNetwork('devnet');
    expect(result).toBeInstanceOf(StacksDevnet);
  });

  test('returns StacksMainnet instance for unknown network', () => {
    const result = getNetwork('unknown');
    expect(result).toBeInstanceOf(StacksMainnet);
  });
});

describe('getExplorerUrl', () => {
  const testTxId = '0x123abc';

  test('returns mainnet explorer URL', () => {
    const result = getExplorerUrl('mainnet', testTxId);
    expect(result).toBe('https://explorer.hiro.so/txid/0x123abc?chain=mainnet');
  });

  test('returns testnet explorer URL', () => {
    const result = getExplorerUrl('testnet', testTxId);
    expect(result).toBe('https://explorer.hiro.so/txid/0x123abc?chain=testnet');
  });

  test('returns devnet explorer URL without chain param', () => {
    const result = getExplorerUrl('devnet', testTxId);
    expect(result).toBe('http://localhost:8000/txid/0x123abc');
  });
});

describe('validatePrivateKey', () => {
  test('returns error for null key', () => {
    const result = validatePrivateKey(null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not set');
  });

  test('returns error for undefined key', () => {
    const result = validatePrivateKey(undefined);
    expect(result.valid).toBe(false);
  });

  test('returns error for empty string', () => {
    const result = validatePrivateKey('');
    expect(result.valid).toBe(false);
  });

  test('validates 64 character hex key', () => {
    const validKey = 'a'.repeat(64);
    const result = validatePrivateKey(validKey);
    expect(result.valid).toBe(true);
    expect(result.key).toBe(validKey);
  });

  test('validates 66 character hex key (with compression suffix)', () => {
    const validKey = 'a'.repeat(66);
    const result = validatePrivateKey(validKey);
    expect(result.valid).toBe(true);
    expect(result.key).toBe(validKey);
  });

  test('strips 0x prefix', () => {
    const key = 'a'.repeat(64);
    const result = validatePrivateKey('0x' + key);
    expect(result.valid).toBe(true);
    expect(result.key).toBe(key);
  });

  test('strips quotes', () => {
    const key = 'a'.repeat(64);
    const result = validatePrivateKey('"' + key + '"');
    expect(result.valid).toBe(true);
    expect(result.key).toBe(key);
  });

  test('trims whitespace', () => {
    const key = 'a'.repeat(64);
    const result = validatePrivateKey('  ' + key + '  ');
    expect(result.valid).toBe(true);
    expect(result.key).toBe(key);
  });

  test('returns error for invalid characters', () => {
    const invalidKey = 'g'.repeat(64);
    const result = validatePrivateKey(invalidKey);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid private key format');
  });

  test('returns error for wrong length', () => {
    const shortKey = 'a'.repeat(32);
    const result = validatePrivateKey(shortKey);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid private key format');
  });
});

describe('logDryRun', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('logs basic details', () => {
    logDryRun({
      action: 'Test Action',
      network: 'testnet'
    });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('DRY RUN'));
    expect(consoleSpy).toHaveBeenCalledWith('Action: Test Action');
    expect(consoleSpy).toHaveBeenCalledWith('Network: testnet');
  });

  test('logs contract and function when provided', () => {
    logDryRun({
      action: 'Deploy',
      network: 'mainnet',
      contract: 'test-contract',
      function: 'test-function'
    });

    expect(consoleSpy).toHaveBeenCalledWith('Contract: test-contract');
    expect(consoleSpy).toHaveBeenCalledWith('Function: test-function');
  });

  test('logs arguments when provided', () => {
    logDryRun({
      action: 'Call',
      network: 'mainnet',
      args: {
        amount: '10 STX',
        recipient: 'SP123'
      }
    });

    expect(consoleSpy).toHaveBeenCalledWith('Arguments:');
    expect(consoleSpy).toHaveBeenCalledWith('  amount: 10 STX');
    expect(consoleSpy).toHaveBeenCalledWith('  recipient: SP123');
  });
});
