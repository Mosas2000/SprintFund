import { STACKS_MAINNET, type StacksNetwork } from '@stacks/network';

// Constants for API URLs (not available on network object in @stacks/network v7+)
export const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
export const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export interface StacksNetworkType {
  coreApiUrl: string;
  chainId: number;
  bnsLookupUrl: string;
}

// Build a compatible network type from the new API
export const getStacksNetworkConfig = (): StacksNetworkType => {
  return {
    coreApiUrl: MAINNET_API_URL,
    chainId: STACKS_MAINNET.chainId,
    bnsLookupUrl: MAINNET_BNS_URL,
  };
};

export const isStacksNetworkValid = (network: unknown): network is StacksNetworkType => {
  return (
    typeof network === 'object' &&
    network !== null &&
    'coreApiUrl' in network &&
    typeof (network as StacksNetworkType).coreApiUrl === 'string' &&
    'chainId' in network &&
    typeof (network as StacksNetworkType).chainId === 'number' &&
    'bnsLookupUrl' in network &&
    typeof (network as StacksNetworkType).bnsLookupUrl === 'string'
  );
};

export const assertStacksNetworkValid = (network: unknown): asserts network is StacksNetworkType => {
  if (!isStacksNetworkValid(network)) {
    throw new Error('Network configuration is invalid');
  }
};

export const getStacksNetworkType = (): StacksNetworkType => {
  return getStacksNetworkConfig();
};

export { STACKS_MAINNET, type StacksNetwork };
