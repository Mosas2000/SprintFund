import { STACKS_MAINNET } from '@stacks/network';

export interface StacksNetworkType {
  coreApiUrl: string;
  chainId: number;
  bnsLookupUrl: string;
}

export const isStacksNetworkValid = (network: any): network is StacksNetworkType => {
  return (
    typeof network === 'object' &&
    typeof network.coreApiUrl === 'string' &&
    typeof network.chainId === 'number' &&
    typeof network.bnsLookupUrl === 'string'
  );
};

export const assertStacksNetworkValid = (): asserts STACKS_MAINNET is StacksNetworkType => {
  if (!isStacksNetworkValid(STACKS_MAINNET)) {
    throw new Error('STACKS_MAINNET configuration is invalid');
  }
};

export const getStacksNetworkType = (): StacksNetworkType => {
  assertStacksNetworkValid();
  return STACKS_MAINNET;
};
