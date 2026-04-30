import { 
  callReadOnlyFunction, 
  cvToValue, 
  standardPrincipalCV, 
  uintCV 
} from '@stacks/transactions';
import { 
  API_URL, 
  CONTRACT_ADDRESS, 
  CONTRACT_NAME, 
  EXPECTED_CONTRACT_VERSION,
  NETWORK 
} from '../config';

export interface ContractVersionInfo {
  version: number;
  isSupported: boolean;
  isValidated: boolean;
  error?: string;
}

class ContractVersionService {
  private cache: ContractVersionInfo | null = null;
  private pendingPromise: Promise<ContractVersionInfo> | null = null;

  async getVersionInfo(forceRefresh = false): Promise<ContractVersionInfo> {
    if (this.cache && !forceRefresh) {
      return this.cache;
    }

    if (this.pendingPromise) {
      return this.pendingPromise;
    }

    this.pendingPromise = this.fetchVersion();
    try {
      const info = await this.pendingPromise;
      this.cache = info;
      return info;
    } finally {
      this.pendingPromise = null;
    }
  }

  private async fetchVersion(): Promise<ContractVersionInfo> {
    try {
      // Call get-version read-only function
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-version',
        functionArgs: [],
        network: NETWORK,
        senderAddress: CONTRACT_ADDRESS, // Use contract address as sender for simplicity
      });

      const version = Number(cvToValue(result).value);
      
      return {
        version,
        isSupported: version === EXPECTED_CONTRACT_VERSION,
        isValidated: true,
      };
    } catch (error: unknown) {
      console.error('Failed to detect contract version:', error);
      
      return {
        version: 0,
        isSupported: false,
        isValidated: false,
        error: error.message || 'Unknown error during version detection',
      };
    }
  }

  clearCache() {
    this.cache = null;
  }
}

export const contractVersionService = new ContractVersionService();
