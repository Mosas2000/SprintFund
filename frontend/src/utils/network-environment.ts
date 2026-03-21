import { STACKS_MAINNET } from '@stacks/network';

export const NetworkEnvironmentDetector = {
  isMainnet: () => STACKS_MAINNET.chainId === 1,
  isTestnet: () => STACKS_MAINNET.chainId === 2147483648,
  getEnvironment: () => {
    const chainId = STACKS_MAINNET.chainId;
    if (chainId === 1) return 'mainnet';
    if (chainId === 2147483648) return 'testnet';
    return 'unknown';
  },
  getApiUrl: () => STACKS_MAINNET.coreApiUrl,
  getBnsUrl: () => STACKS_MAINNET.bnsLookupUrl,
  getChainId: () => STACKS_MAINNET.chainId,
};

export const getNetworkExplorerUrl = (txId: string): string => {
  const env = NetworkEnvironmentDetector.getEnvironment();
  const chain = env === 'mainnet' ? 'mainnet' : 'testnet';
  return `https://explorer.hiro.so/txid/${txId}?chain=${chain}`;
};

export const getNetworkAddressUrl = (address: string): string => {
  const env = NetworkEnvironmentDetector.getEnvironment();
  const chain = env === 'mainnet' ? 'mainnet' : 'testnet';
  return `https://explorer.hiro.so/address/${address}?chain=${chain}`;
};
