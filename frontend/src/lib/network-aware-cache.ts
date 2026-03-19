type NetworkType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

interface NetworkAwareCacheTTLs {
  slowNetwork: Record<string, number>;
  fastNetwork: Record<string, number>;
}

const NETWORK_AWARE_TTLS: NetworkAwareCacheTTLs = {
  slowNetwork: {
    proposal: 30 * 60 * 1000,
    page: 30 * 60 * 1000,
    count: 30 * 60 * 1000,
    stake: 30 * 60 * 1000,
    minStake: 2 * 60 * 60 * 1000,
  },
  fastNetwork: {
    proposal: 5 * 60 * 1000,
    page: 5 * 60 * 1000,
    count: 5 * 60 * 1000,
    stake: 5 * 60 * 1000,
    minStake: 30 * 60 * 1000,
  },
};

export class NetworkAwareCaching {
  private currentNetworkType: NetworkType = 'unknown';
  private connectionType: any;

  constructor() {
    this.detectNetworkConnection();
    this.setupNetworkListener();
  }

  private detectNetworkConnection(): void {
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      this.connectionType = (navigator as any).connection;
      this.currentNetworkType = this.getNetworkTypeFromConnection();
    }
  }

  private setupNetworkListener(): void {
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      this.connectionType.addEventListener('change', () => {
        this.currentNetworkType = this.getNetworkTypeFromConnection();
      });
    }
  }

  private getNetworkTypeFromConnection(): NetworkType {
    if (!this.connectionType) return 'unknown';

    const effectiveType = this.connectionType.effectiveType;
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return '2g';
      case '3g':
        return '3g';
      case '4g':
        return '4g';
      default:
        return 'unknown';
    }
  }

  isSlowNetwork(): boolean {
    return this.currentNetworkType === '2g' || this.currentNetworkType === '3g';
  }

  getTTLForNetworkType(dataType: string): number {
    const ttlMap = this.isSlowNetwork()
      ? NETWORK_AWARE_TTLS.slowNetwork
      : NETWORK_AWARE_TTLS.fastNetwork;

    return ttlMap[dataType] || NETWORK_AWARE_TTLS.fastNetwork[dataType] || 10 * 60 * 1000;
  }

  getNetworkType(): NetworkType {
    return this.currentNetworkType;
  }

  getEffectiveType(): string {
    if (!this.connectionType) return 'unknown';
    return this.connectionType.effectiveType || 'unknown';
  }
}

export const networkAwareCaching = new NetworkAwareCaching();
