import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

export const STACKS_NETWORK_CONFIG = {
  mainnet: {
    name: 'mainnet',
    url: 'https://stacks-node-api.mainnet.stacks.co',
    deprecatedImport: 'StacksMainnet (deprecated)',
    currentImport: 'STACKS_MAINNET',
  },
  testnet: {
    name: 'testnet',
    url: 'https://stacks-node-api.testnet.stacks.co',
    deprecatedImport: 'StacksTestnet (deprecated)',
    currentImport: 'STACKS_TESTNET',
  },
};

export const getStacksNetwork = () => {
  const env = process.env.REACT_APP_NETWORK || 'mainnet';
  
  if (env === 'testnet') {
    return STACKS_TESTNET;
  }
  
  return STACKS_MAINNET;
};
