import { STACKS_MAINNET } from '@stacks/network';

const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

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

  if (!MAINNET_API_URL) {
    errors.push('API URL is not configured');
  }

  if (!STACKS_MAINNET.chainId) {
    errors.push('STACKS_MAINNET.chainId is missing');
  }

  if (!MAINNET_BNS_URL) {
    warnings.push('BNS lookup URL is not configured');
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
