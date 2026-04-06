import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (not available on network object in @stacks/network v7+)
const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export const NetworkEnvironmentDetector = {
  isMainnet: () => STACKS_MAINNET.chainId === 1,
  isTestnet: () => STACKS_MAINNET.chainId === 2147483648,
  getEnvironment: () => {
    const chainId = STACKS_MAINNET.chainId;
    if (chainId === 1) return 'mainnet';
    if (chainId === 2147483648) return 'testnet';
    return 'unknown';
  },
  getApiUrl: () => MAINNET_API_URL,
  getBnsUrl: () => MAINNET_BNS_URL,
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
