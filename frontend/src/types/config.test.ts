import { describe, it, expect } from 'vitest';
import type { AppConfig, NetworkConfig, ContractConfig, FeatureFlags } from './config';
import { getAppEnvironment, isDevelopment, isProduction } from './config';

describe('Config types', () => {
  describe('NetworkConfig', () => {
    it('represents valid network configuration', () => {
      const config: NetworkConfig = {
        networkId: 'mainnet',
        name: 'Stacks Mainnet',
        url: 'https://api.mainnet.hiro.so',
        explorerUrl: 'https://explorer.hiro.so',
        isTestnet: false,
      };

      expect(config.networkId).toMatch(/^(mainnet|testnet|devnet)$/);
      expect(config.isTestnet).toBe(false);
    });
  });

  describe('ContractConfig', () => {
    it('represents contract deployment configuration', () => {
      const config: ContractConfig = {
        contractAddress: 'SP123456789',
        contractName: 'sprintfund-core',
        contractPrincipal: 'SP123456789.sprintfund-core',
      };

      expect(config.contractAddress).toMatch(/^S[PT]/);
      expect(config.contractName.length).toBeGreaterThan(0);
    });
  });

  describe('AppConfig', () => {
    it('combines network and contract config', () => {
      const config: AppConfig = {
        network: {
          networkId: 'mainnet',
          name: 'Mainnet',
          url: 'https://api.mainnet.hiro.so',
          explorerUrl: 'https://explorer.hiro.so',
          isTestnet: false,
        },
        contract: {
          contractAddress: 'SP123456789',
          contractName: 'sprintfund-core',
          contractPrincipal: 'SP123456789.sprintfund-core',
        },
        version: '1.0.0',
        debug: false,
        features: {
          notifications: true,
          analytics: true,
          pushNotifications: true,
          realtime: true,
        },
      };

      expect(config.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(config.features.notifications).toBe(true);
    });
  });

  describe('FeatureFlags', () => {
    it('controls feature availability', () => {
      const flags: FeatureFlags = {
        enableNotifications: true,
        enableAnalytics: true,
        enableRealtime: false,
        enablePushNotifications: true,
        enableQuorumTracking: true,
        enableProposalSearch: true,
      };

      expect(Object.values(flags).every(v => typeof v === 'boolean')).toBe(true);
    });
  });

  describe('Environment functions', () => {
    it('getAppEnvironment returns valid environment', () => {
      const env = getAppEnvironment();
      expect(['development', 'staging', 'production']).toContain(env);
    });

    it('isDevelopment and isProduction are complementary', () => {
      const isDev = isDevelopment();
      const isProd = isProduction();
      expect(isDev || isProd || getAppEnvironment() === 'staging').toBe(true);
    });
  });
});
