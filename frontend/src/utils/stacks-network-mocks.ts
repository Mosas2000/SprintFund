import { STACKS_MAINNET } from '@stacks/network';

// Mock network config type for testing
export interface MockStacksNetworkConfig {
  coreApiUrl: string;
  chainId: number;
  bnsLookupUrl: string;
}

export const createMockStacksNetwork = (): MockStacksNetworkConfig => {
  return {
    coreApiUrl: 'http://localhost:3999',
    chainId: 1,
    bnsLookupUrl: 'http://localhost:3999',
  };
};

export const mockStacksMainnet = (overrides: Partial<MockStacksNetworkConfig> = {}): MockStacksNetworkConfig => {
  return {
    coreApiUrl: 'https://api.mainnet.hiro.so',
    chainId: STACKS_MAINNET.chainId,
    bnsLookupUrl: 'https://api.mainnet.hiro.so',
    ...overrides,
  };
};

export const resetStacksNetwork = () => {
  return STACKS_MAINNET;
};
