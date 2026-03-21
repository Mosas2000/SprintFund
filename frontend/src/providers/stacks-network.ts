import { STACKS_MAINNET } from '@stacks/network';

export const StacksNetworkProvider = () => {
  const validateNetwork = () => {
    const requiredFields = ['coreApiUrl', 'chainId'];
    return requiredFields.every((field) => field in STACKS_MAINNET);
  };

  const getNetworkInfo = () => ({
    isValid: validateNetwork(),
    url: STACKS_MAINNET.coreApiUrl,
    chainId: STACKS_MAINNET.chainId,
    bnsUrl: STACKS_MAINNET.bnsLookupUrl,
  });

  return {
    network: STACKS_MAINNET,
    getNetworkInfo,
    validateNetwork,
  };
};

export default StacksNetworkProvider();
