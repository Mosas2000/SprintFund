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
    const { STACKS_TESTNET } = require('@stacks/network');
    return STACKS_TESTNET;
  }
  
  const { STACKS_MAINNET } = require('@stacks/network');
  return STACKS_MAINNET;
};
