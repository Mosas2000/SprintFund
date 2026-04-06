import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (not available on network object in @stacks/network v7+)
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
  // In @stacks/network v7+, only chainId is available on the network object
  // API URLs are now constants, not properties of the network
  if (!STACKS_MAINNET || typeof STACKS_MAINNET.chainId !== 'number') {
    console.warn('Warning: STACKS_MAINNET.chainId is missing');
    return false;
  }
  
  return true;
};
