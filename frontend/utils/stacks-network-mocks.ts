import { STACKS_MAINNET } from '@stacks/network';
import { mockDeep } from 'jest-mock-extended';

export const createMockStacksNetwork = () => {
  return {
    coreApiUrl: 'http://localhost:3999',
    chainId: 1,
    bnsLookupUrl: 'http://localhost:3999',
  };
};

export const mockStacksMainnet = (overrides = {}) => {
  return {
    ...STACKS_MAINNET,
    ...overrides,
  };
};

export const resetStacksNetwork = () => {
  return STACKS_MAINNET;
};
