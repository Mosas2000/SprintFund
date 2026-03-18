/**
 * Configuration and environment types.
 */

/**
 * Network configuration.
 */
export interface NetworkConfig {
  networkId: 'mainnet' | 'testnet' | 'devnet';
  name: string;
  url: string;
  explorerUrl: string;
  isTestnet: boolean;
}

/**
 * Contract configuration.
 */
export interface ContractConfig {
  contractAddress: string;
  contractName: string;
  contractPrincipal: string;
}

/**
 * Application configuration combining network and contract settings.
 */
export interface AppConfig {
  network: NetworkConfig;
  contract: ContractConfig;
  version: string;
  debug: boolean;
  features: {
    notifications: boolean;
    analytics: boolean;
    pushNotifications: boolean;
    realtime: boolean;
  };
}

/**
 * Cache configuration.
 */
export interface CacheConfig {
  proposalTTL: number;
  stakeTTL: number;
  voteTTL: number;
  defaultTTL: number;
  maxSize: number;
}

/**
 * Feature flags.
 */
export interface FeatureFlags {
  enableNotifications: boolean;
  enableAnalytics: boolean;
  enableRealtime: boolean;
  enablePushNotifications: boolean;
  enableQuorumTracking: boolean;
  enableProposalSearch: boolean;
}

/**
 * Validation configuration.
 */
export interface ValidationConfig {
  minProposalTitle: number;
  maxProposalTitle: number;
  minProposalDescription: number;
  maxProposalDescription: number;
  minAmountMicroStx: number;
  maxAmountMicroStx: number;
  minStakeAmount: number;
}

/**
 * Application environment.
 */
export type AppEnvironment = 'development' | 'staging' | 'production';

/**
 * Get app environment from URL or env var.
 */
export function getAppEnvironment(): AppEnvironment {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return 'development';
    }
    if (host.includes('staging')) {
      return 'staging';
    }
  }
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

/**
 * Check if running in production.
 */
export function isProduction(): boolean {
  return getAppEnvironment() === 'production';
}

/**
 * Check if running in development.
 */
export function isDevelopment(): boolean {
  return getAppEnvironment() === 'development';
}
