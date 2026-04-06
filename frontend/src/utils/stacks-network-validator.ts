import { STACKS_MAINNET } from '@stacks/network';

// Constants for API URLs (not available on network object in @stacks/network v7+)
export const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
export const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export interface StacksNetworkValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateStacksNetwork = (): StacksNetworkValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!STACKS_MAINNET) {
    errors.push('STACKS_MAINNET constant is not defined');
    return { isValid: false, errors, warnings };
  }

  // In @stacks/network v7+, only chainId is available on the network object
  // API URLs are now constants, not properties
  if (typeof STACKS_MAINNET.chainId !== 'number') {
    errors.push('STACKS_MAINNET.chainId is missing or invalid');
  }

  // Validate our constants are defined (informational)
  if (!MAINNET_API_URL) {
    warnings.push('MAINNET_API_URL constant should be defined');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export const printNetworkValidation = (): void => {
  const validation = validateStacksNetwork();
  
  if (!validation.isValid) {
    console.error('Network validation failed:');
    validation.errors.forEach((err) => console.error(`  - ${err}`));
  } else {
    console.log('Network validation passed');
  }

  if (validation.warnings.length > 0) {
    console.warn('Network warnings:');
    validation.warnings.forEach((warn) => console.warn(`  - ${warn}`));
  }
};
