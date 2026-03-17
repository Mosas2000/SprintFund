import { useEffect, useRef } from 'react';
import { useNotificationGenerator } from './useNotificationGenerator';
import type { RawProposal } from './useNotificationGenerator';
import { API_URL, CONTRACT_PRINCIPAL } from '../config';

const POLL_INTERVAL_MS = 30_000;

async function fetchProposalCount(): Promise<number> {
  const url = `${API_URL}/v2/contracts/call-read/${CONTRACT_PRINCIPAL}/get-proposal-count`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sender: CONTRACT_PRINCIPAL.split('.')[0], arguments: [] }),
  });

  if (!res.ok) return 0;
  const data = await res.json();
  if (!data.result) return 0;

  const hex = data.result.replace('0x', '');
  return parseInt(hex.slice(-16), 16) || 0;
}

async function fetchProposalData(id: number): Promise<RawProposal | null> {
  const paddedId = id.toString(16).padStart(16, '0');
  const url = `${API_URL}/v2/contracts/call-read/${CONTRACT_PRINCIPAL}/get-proposal`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: CONTRACT_PRINCIPAL.split('.')[0],
      arguments: [`0x0100000000000000${paddedId}`],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data.result || data.result === '0x09') return null;

  return {
    id,
    executed: data.result.includes('executed') || false,
    voteCount: 0,
  };
}

export function useNotificationPolling(enabled = true) {
  const processProposals = useNotificationGenerator();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    async function poll() {
      try {
        const count = await fetchProposalCount();
        if (count === 0) return;

        const proposals: RawProposal[] = [];
        const start = Math.max(1, lastCountRef.current || 1);
        for (let i = start; i <= count; i++) {
          const p = await fetchProposalData(i);
          if (p) proposals.push(p);
        }

        lastCountRef.current = count;

        if (proposals.length > 0) {
          processProposals(proposals);
        }
      } catch {
        // Network error, will retry on next interval
      }
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, processProposals]);
}
