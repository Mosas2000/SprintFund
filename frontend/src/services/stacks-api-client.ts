import { STACKS_MAINNET } from '@stacks/network';

export const createStacksNetworkConfig = () => {
  return {
    apiUrl: STACKS_MAINNET.coreApiUrl,
    chainId: STACKS_MAINNET.chainId,
    bnsUrl: STACKS_MAINNET.bnsLookupUrl,
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
      const response = await fetch(url, { timeout: config.timeout });
      return response.json();
    },
  };
};
