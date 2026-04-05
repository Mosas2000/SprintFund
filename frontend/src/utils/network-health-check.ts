import { STACKS_MAINNET } from '@stacks/network';

// API URL for mainnet
const MAINNET_API_URL = 'https://api.mainnet.hiro.so';
const MAINNET_BNS_URL = 'https://api.mainnet.hiro.so';

export interface StacksNetworkHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  apiUrl: string;
  chainId: number;
  bnsUrl: string;
  timestamp: string;
  errors: string[];
}

export const checkStacksNetworkHealth = async (): Promise<StacksNetworkHealthCheck> => {
  const errors: string[] = [];
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  const apiUrl = MAINNET_API_URL;
  const bnsUrl = MAINNET_BNS_URL;
  const chainId = STACKS_MAINNET.chainId;

  if (!apiUrl) {
    errors.push('Core API URL not configured');
    status = 'unhealthy';
  }

  if (!chainId) {
    errors.push('Chain ID not configured');
    status = 'unhealthy';
  }

  if (!bnsUrl) {
    errors.push('BNS lookup URL not configured');
    status = 'degraded';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${apiUrl}/v2/info`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      errors.push(`API health check failed: ${response.status}`);
      status = status === 'healthy' ? 'degraded' : status;
    }
  } catch (error) {
    errors.push(`API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    status = 'unhealthy';
  }

  return {
    status,
    apiUrl,
    chainId,
    bnsUrl,
    timestamp: new Date().toISOString(),
    errors,
  };
};
