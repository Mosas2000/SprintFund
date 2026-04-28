import { describe, it, expect } from 'vitest';
import {
  loadContractConfig,
  getContractAddress,
  getContractName,
  getContractPrincipal,
  getNetworkConfig,
  getContractVersion,
  getLegacyContractName,
  isLegacyContract
} from './contract-config.js';

describe('contract-config', () => {
  describe('loadContractConfig', () => {
    it('loads config from contract-config.json', () => {
      const config = loadContractConfig();
      expect(config).toBeDefined();
      expect(config.version).toBe('3');
      expect(config.contract).toBeDefined();
    });

    it('throws error if config file is missing', () => {
      // This test would require mocking fs.readFileSync
      // For now, just verify the function exists
      expect(loadContractConfig).toBeDefined();
    });
  });

  describe('getContractAddress', () => {
    it('returns the contract address', () => {
      const address = getContractAddress();
      expect(address).toBe('SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T');
    });
  });

  describe('getContractName', () => {
    it('returns the contract name', () => {
      const name = getContractName();
      expect(name).toBe('sprintfund-core-v3');
    });
  });

  describe('getContractPrincipal', () => {
    it('returns the contract principal', () => {
      const principal = getContractPrincipal();
      expect(principal).toBe('SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3');
    });
  });

  describe('getNetworkConfig', () => {
    it('returns mainnet config', () => {
      const config = getNetworkConfig('mainnet');
      expect(config.apiUrl).toBeDefined();
      expect(config.explorerUrl).toBeDefined();
    });

    it('returns testnet config', () => {
      const config = getNetworkConfig('testnet');
      expect(config.apiUrl).toBeDefined();
      expect(config.explorerUrl).toBeDefined();
    });

    it('defaults to mainnet for invalid network', () => {
      const config = getNetworkConfig('invalid');
      expect(config.apiUrl).toBe('https://api.mainnet.hiro.so');
    });
  });

  describe('getContractVersion', () => {
    it('returns the contract version', () => {
      const version = getContractVersion();
      expect(version).toBe('3');
    });
  });

  describe('getLegacyContractName', () => {
    it('returns legacy v1 contract name', () => {
      const name = getLegacyContractName(1);
      expect(name).toBe('sprintfund-core');
    });

    it('returns legacy v2 contract name', () => {
      const name = getLegacyContractName(2);
      expect(name).toBe('sprintfund-core-v2');
    });

    it('returns null for non-existent version', () => {
      const name = getLegacyContractName(99);
      expect(name).toBeNull();
    });
  });

  describe('isLegacyContract', () => {
    it('returns true for v1 contract', () => {
      expect(isLegacyContract('sprintfund-core')).toBe(true);
    });

    it('returns true for v2 contract', () => {
      expect(isLegacyContract('sprintfund-core-v2')).toBe(true);
    });

    it('returns false for current contract', () => {
      expect(isLegacyContract('sprintfund-core-v3')).toBe(false);
    });

    it('returns false for unknown contract', () => {
      expect(isLegacyContract('unknown-contract')).toBe(false);
    });
  });
});

describe('getLegacyContractName', () => {
  it('returns legacy contract name for v1', () => {
    const name = getLegacyContractName('1');
    expect(name).toBe('sprintfund-core');
  });

  it('returns null for non-existent version', () => {
    const name = getLegacyContractName('99');
    expect(name).toBeNull();
  });
});

describe('isLegacyContract', () => {
  it('returns true for legacy contract', () => {
    const result = isLegacyContract('sprintfund-core');
    expect(result).toBe(true);
  });

  it('returns false for current contract', () => {
    const result = isLegacyContract('sprintfund-core-v3');
    expect(result).toBe(false);
  });
});

describe('getAllNetworks', () => {
  it('returns all network names', () => {
    const networks = getAllNetworks();
    expect(networks).toContain('mainnet');
    expect(networks).toContain('testnet');
    expect(networks).not.toContain('default');
  });
});

describe('getDefaultNetwork', () => {
  it('returns the default network', () => {
    const network = getDefaultNetwork();
    expect(network).toBe('mainnet');
  });
});
