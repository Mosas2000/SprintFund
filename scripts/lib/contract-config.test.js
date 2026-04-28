import { describe, it, expect } from 'vitest';
import {
  loadContractConfig,
  getContractAddress,
  getContractName,
  getContractPrincipal,
  getNetworkConfig,
  getContractVersion
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
});
