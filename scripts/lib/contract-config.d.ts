export interface ContractConfig {
  version: string;
  contract: {
    address: string;
    name: string;
    principal: string;
  };
  network: {
    default: string;
    mainnet: {
      apiUrl: string;
      explorerUrl: string;
    };
    testnet: {
      apiUrl: string;
      explorerUrl: string;
    };
  };
  legacy: {
    v1: {
      name: string;
      status: string;
    };
    v2: {
      name: string;
      status: string;
    };
  };
}

export function loadContractConfig(): ContractConfig;
export function getContractAddress(): string;
export function getContractName(): string;
export function getContractPrincipal(): string;
export function getNetworkConfig(networkName?: string): { apiUrl: string; explorerUrl: string };
export function getContractVersion(): string;
export function getLegacyContractName(version: string | number): string | null;
export function isLegacyContract(contractName: string): boolean;
