import { STACKS_MAINNET } from '@stacks/network';

const MAINNET_API_URL = 'https://api.mainnet.hiro.so';

export const initializeStacksNetwork = () => {
  if (!STACKS_MAINNET) {
    throw new Error('STACKS_MAINNET is not available. Check @stacks/network package');
  }
  return STACKS_MAINNET;
};

export const getNetworkUrl = () => {
  return MAINNET_API_URL;
};

export const getNetworkChainId = () => {
  return STACKS_MAINNET?.chainId;
};

export const validateNetworkConfig = () => {
  const requiredProperties = ['chainId'];
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
