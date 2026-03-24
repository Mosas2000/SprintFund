export interface PriceData {
  usd: number;
  usdChange24h: number;
  lastUpdated: number;
}

export interface PriceState {
  price: PriceData | null;
  loading: boolean;
  error: string | null;
}

export interface CoinGeckoResponse {
  blockstack: {
    usd: number;
    usd_24h_change: number;
  };
}
