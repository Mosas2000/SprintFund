import contractConfig from '../../../contract-config.json';

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

export const config: ContractConfig = contractConfig;

export function getContractAddress(): string {
  return config.contract.address;
}

export function getContractName(): string {
  return config.contract.name;
}

export function getContractPrincipal(): string {
  return config.contract.principal;
}

export function getContractVersion(): string {
  return config.version;
}

export function getNetworkApiUrl(network: 'mainnet' | 'testnet'): string {
  return config.network[network].apiUrl;
}

export function getExplorerUrl(network: 'mainnet' | 'testnet'): string {
  return config.network[network].explorerUrl;
}

export function getLegacyContractName(version: string | number): string | null {
  const legacyKey = `v${version}` as keyof typeof config.legacy;
  return config.legacy[legacyKey]?.name || null;
}

export function isLegacyContract(contractName: string): boolean {
  const legacyNames = Object.values(config.legacy).map(v => v.name);
  return legacyNames.includes(contractName);
}
