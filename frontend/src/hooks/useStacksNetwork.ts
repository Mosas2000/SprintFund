import { STACKS_MAINNET } from '@stacks/network';

export const StacksNetworkHook = () => {
  const network = STACKS_MAINNET;

  const getNetworkStatus = () => {
    return {
      name: 'mainnet',
      isHealthy: !!network.coreApiUrl,
      apiUrl: network.coreApiUrl,
      chainId: network.chainId,
      bnsLookupUrl: network.bnsLookupUrl,
    };
  };

  const getNetworkEndpoint = (endpoint: string) => {
    return `${network.coreApiUrl}${endpoint}`;
  };

  return {
    network,
    getNetworkStatus,
    getNetworkEndpoint,
  };
};
