import { API_URL } from '../config';

export async function getStxBalance(address: string): Promise<number> {
  const res = await fetch(`${API_URL}/extended/v1/address/${address}/stx`);
  if (!res.ok) return 0;
  const data = await res.json();
  return Number(data.balance ?? 0);
}

export async function getTxStatus(txId: string): Promise<string> {
  const res = await fetch(`${API_URL}/extended/v1/tx/${txId}`);
  if (!res.ok) return 'unknown';
  const data = await res.json();
  return data.tx_status ?? 'unknown';
}

export function explorerTxUrl(txId: string): string {
  return `https://explorer.hiro.so/txid/${txId}?chain=mainnet`;
}

export function explorerAddressUrl(address: string): string {
  return `https://explorer.hiro.so/address/${address}?chain=mainnet`;
}

export function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
