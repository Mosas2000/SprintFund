import { STACKS_MAINNET } from '@stacks/network';

export const initializeStacksNetwork = () => {
  if (!STACKS_MAINNET) {
    throw new Error('STACKS_MAINNET is not available. Check @stacks/network package');
  }
  return STACKS_MAINNET;
};

export const getNetworkUrl = () => {
  return STACKS_MAINNET?.coreApiUrl || 'https://stacks-node-api.mainnet.stacks.co';
};

export const getNetworkChainId = () => {
  return STACKS_MAINNET?.chainId;
};

export const validateNetworkConfig = () => {
  const requiredProperties = ['coreApiUrl', 'chainId', 'bnsLookupUrl'];
  const missingProperties = requiredProperties.filter(
    (prop) => !(prop in STACKS_MAINNET)
  );
  
  if (missingProperties.length > 0) {
    console.warn(
      `Warning: STACKS_MAINNET missing properties: ${missingProperties.join(', ')}`
    );
    return false;
  }
  
  return true;
};
