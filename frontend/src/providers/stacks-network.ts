import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (no longer available on STACKS_MAINNET object)
const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export const StacksNetworkProvider = () => {
  const validateNetwork = () => {
    // Only chainId is available on the network object now
    return 'chainId' in STACKS_MAINNET;
  };

  const getNetworkInfo = () => ({
    isValid: validateNetwork(),
    url: MAINNET_API_URL,
    chainId: STACKS_MAINNET.chainId,
    bnsUrl: MAINNET_BNS_URL,
  });

  return {
    network: STACKS_MAINNET,
    getNetworkInfo,
    validateNetwork,
  };
};

export default StacksNetworkProvider();
