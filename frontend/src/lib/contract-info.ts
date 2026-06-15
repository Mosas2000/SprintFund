import { cvToValue, fetchCallReadOnlyFunction } from '@stacks/transactions';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '../../config';

const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

/**
 * Fetch minimum stake amount from contract
 * @returns Minimum stake in microSTX
 */
export async function fetchMinStakeAmount(): Promise<number> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-min-stake-amount',
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    const value = cvToValue(result);
    return typeof value === 'object' && 'value' in value 
      ? Number(value.value) 
      : Number(value);
  } catch (error) {
    console.error('Failed to fetch min stake amount:', error);
    return 100; // Default fallback
  }
}

/**
 * Fetch contract version
 * @returns Contract version number
 */
export async function fetchContractVersion(): Promise<number> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-version',
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    const value = cvToValue(result);
    return typeof value === 'object' && 'value' in value 
      ? Number(value.value) 
      : Number(value);
  } catch (error) {
    console.error('Failed to fetch contract version:', error);
    return 5; // Default to v5
  }
}

/**
 * Fetch contract owner
 * @returns Contract owner principal address
 */
export async function fetchContractOwner(): Promise<string | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-contract-owner',
      functionArgs: [],
      network,
      senderAddress: CONTRACT_ADDRESS,
    });

    const value = cvToValue(result);
    return typeof value === 'object' && 'value' in value 
      ? String(value.value) 
      : String(value);
  } catch (error) {
    console.error('Failed to fetch contract owner:', error);
    return null;
  }
}

/**
 * Check if address is contract owner
 */
export async function isContractOwner(address: string): Promise<boolean> {
  const owner = await fetchContractOwner();
  return owner === address;
}
