import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (no longer available on STACKS_MAINNET object)
const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export const createStacksNetworkConfig = () => {
  return {
    apiUrl: MAINNET_API_URL,
    chainId: STACKS_MAINNET.chainId,
    bnsUrl: MAINNET_BNS_URL,
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
  };
};

export const getStacksApiClient = async () => {
  const config = createStacksNetworkConfig();
  
  return {
    config,
    fetch: async (endpoint: string) => {
      const url = `${config.apiUrl}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        return response.json();
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
};
