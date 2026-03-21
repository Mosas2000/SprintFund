import { STACKS_MAINNET } from '@stacks/network';

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

  if (!STACKS_MAINNET.coreApiUrl) {
    errors.push('Core API URL not configured');
    status = 'unhealthy';
  }

  if (!STACKS_MAINNET.chainId) {
    errors.push('Chain ID not configured');
    status = 'unhealthy';
  }

  if (!STACKS_MAINNET.bnsLookupUrl) {
    errors.push('BNS lookup URL not configured');
    status = 'degraded';
  }

  try {
    const response = await fetch(`${STACKS_MAINNET.coreApiUrl}/v2/info`, {
      method: 'GET',
      timeout: 5000,
    });
    
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
    apiUrl: STACKS_MAINNET.coreApiUrl,
    chainId: STACKS_MAINNET.chainId,
    bnsUrl: STACKS_MAINNET.bnsLookupUrl,
    timestamp: new Date().toISOString(),
    errors,
  };
};
