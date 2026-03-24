import type { PriceData, CoinGeckoResponse } from '../types/price';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const STX_COIN_ID = 'blockstack';
const CACHE_DURATION_MS = 60000;

let cachedPrice: PriceData | null = null;
let lastFetchTime = 0;

export async function fetchStxPrice(): Promise<PriceData> {
  const now = Date.now();

  if (cachedPrice && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedPrice;
  }

  const url = `${COINGECKO_API_URL}/simple/price?ids=${STX_COIN_ID}&vs_currencies=usd&include_24hr_change=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch STX price: ${response.status}`);
  }

  const data: CoinGeckoResponse = await response.json();

  if (!data.blockstack) {
    throw new Error('Invalid price response from CoinGecko');
  }

  const priceData: PriceData = {
    usd: data.blockstack.usd,
    usdChange24h: data.blockstack.usd_24h_change ?? 0,
    lastUpdated: now,
  };

  cachedPrice = priceData;
  lastFetchTime = now;

  return priceData;
}

export function getCachedPrice(): PriceData | null {
  return cachedPrice;
}

export function clearPriceCache(): void {
  cachedPrice = null;
  lastFetchTime = 0;
}
