import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (no longer available on STACKS_MAINNET object)
const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export const StacksNetworkHook = () => {
  const network = STACKS_MAINNET;

  const getNetworkStatus = () => {
    return {
      name: 'mainnet',
      isHealthy: true,
      apiUrl: MAINNET_API_URL,
      chainId: network.chainId,
      bnsLookupUrl: MAINNET_BNS_URL,
    };
  };

  const getNetworkEndpoint = (endpoint: string) => {
    return `${MAINNET_API_URL}${endpoint}`;
  };

  return {
    network,
    getNetworkStatus,
    getNetworkEndpoint,
  };
};
