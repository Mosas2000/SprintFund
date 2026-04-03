import { NetworkType } from '@stacks/network';

export interface StacksNetworkConfig {
  type: NetworkType;
  url: string;
  deprecatedClass: string;
  currentConstant: string;
  migrationNotes: string[];
}

export const NETWORK_MIGRATION_MAP: Record<string, StacksNetworkConfig> = {
  mainnet: {
    type: 'mainnet',
    url: 'https://stacks-node-api.mainnet.stacks.co',
    deprecatedClass: 'StacksMainnet',
    currentConstant: 'STACKS_MAINNET',
    migrationNotes: [
      'Replace: import { StacksMainnet } from "@stacks/network"',
      'With: import { STACKS_MAINNET } from "@stacks/network"',
      'Remove: const network = new StacksMainnet()',
      'Use: STACKS_MAINNET directly',
    ],
  },
  testnet: {
    type: 'testnet',
    url: 'https://stacks-node-api.testnet.stacks.co',
    deprecatedClass: 'StacksTestnet',
    currentConstant: 'STACKS_TESTNET',
    migrationNotes: [
      'Replace: import { StacksTestnet } from "@stacks/network"',
      'With: import { STACKS_TESTNET } from "@stacks/network"',
      'Remove: const network = new StacksTestnet()',
      'Use: STACKS_TESTNET directly',
    ],
  },
};

export const getMigrationGuide = (networkType: string): StacksNetworkConfig | null => {
  return NETWORK_MIGRATION_MAP[networkType] || null;
};
