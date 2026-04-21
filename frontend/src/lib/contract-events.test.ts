import { describe, it, expect, beforeEach, vi } from 'vitest';
import { normalizeContractTransaction, fetchContractEventStream } from './contract-events';
import { ContractEvent } from '../types/contract-events';

describe('Contract Events', () => {
  describe('normalizeContractTransaction', () => {
    const mockContractPrincipal = 'SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund';

    it('returns null for transactions without contract calls', () => {
      const tx = {
        tx_id: 'test-1',
        block_time: 1000,
        sender_address: 'SP123',
        tx_result: { repr: '(ok true)' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);
      expect(result).toBeNull();
    });

    it('returns null for transactions from different contracts', () => {
      const tx = {
        tx_id: 'test-1',
        block_time: 1000,
        sender_address: 'SP123',
        contract_call: {
          contract_id: 'SP2DIFFERENT.other-contract',
          function_name: 'stake',
        },
        tx_result: { repr: 'u1000' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);
      expect(result).toBeNull();
    });

    it('normalizes stake transactions', () => {
      const tx = {
        tx_id: 'tx-stake-1',
        block_time: 1000,
        sender_address: 'SP123',
        contract_call: {
          contract_id: mockContractPrincipal,
          function_name: 'stake',
        },
        tx_result: { repr: 'u5000' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);

      expect(result).toBeDefined();
      expect(result?.category).toBe('stake');
      expect(result?.status).toBe('success');
      expect(result?.amount).toBe('5000');
      expect(result?.weight).toBe(5000);
    });

    it('normalizes proposal transactions', () => {
      const tx = {
        tx_id: 'tx-prop-1',
        block_time: 2000,
        sender_address: 'SP456',
        contract_call: {
          contract_id: mockContractPrincipal,
          function_name: 'propose',
        },
        tx_result: { repr: 'u42' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);

      expect(result?.category).toBe('proposal');
      expect(result?.proposalId).toBe('42');
    });

    it('normalizes vote transactions', () => {
      const tx = {
        tx_id: 'tx-vote-1',
        block_time: 3000,
        sender_address: 'SP789',
        contract_call: {
          contract_id: mockContractPrincipal,
          function_name: 'vote',
        },
        tx_result: { repr: 'u100' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);

      expect(result?.category).toBe('vote');
      expect(result?.weight).toBe(100);
    });

    it('marks failed transactions correctly', () => {
      const tx = {
        tx_id: 'tx-fail-1',
        block_time: 4000,
        sender_address: 'SP000',
        contract_call: {
          contract_id: mockContractPrincipal,
          function_name: 'stake',
        },
        tx_result: { repr: '(err u1000)' },
      };

      const result = normalizeContractTransaction(tx as any, mockContractPrincipal);

      expect(result?.status).toBe('failed');
    });
  });

  describe('fetchContractEventStream', () => {
    const mockContractPrincipal = 'SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund';

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('fetches and normalizes events from API', async () => {
      const mockResponse = {
        results: [
          {
            tx_id: 'tx-1',
            block_time: 1000,
            sender_address: 'SP123',
            contract_call: {
              contract_id: mockContractPrincipal,
              function_name: 'stake',
            },
            tx_result: { repr: 'u1000' },
          },
          {
            tx_id: 'tx-2',
            block_time: 2000,
            sender_address: 'SP456',
            contract_call: {
              contract_id: mockContractPrincipal,
              function_name: 'vote',
            },
            tx_result: { repr: 'u500' },
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const events = await fetchContractEventStream(mockContractPrincipal);

      expect(events).toHaveLength(2);
      expect(events[0].category).toBe('vote');
      expect(events[1].category).toBe('stake');
    });

    it('throws error on API failure', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(fetchContractEventStream(mockContractPrincipal)).rejects.toThrow(
        'Failed to fetch contract events'
      );
    });

    it('handles empty results', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      });

      const events = await fetchContractEventStream(mockContractPrincipal);

      expect(events).toEqual([]);
    });

    it('sorts events by timestamp descending', async () => {
      const mockResponse = {
        results: [
          {
            tx_id: 'tx-1',
            block_time: 1000,
            sender_address: 'SP123',
            contract_call: {
              contract_id: mockContractPrincipal,
              function_name: 'stake',
            },
            tx_result: { repr: 'u1000' },
          },
          {
            tx_id: 'tx-2',
            block_time: 3000,
            sender_address: 'SP456',
            contract_call: {
              contract_id: mockContractPrincipal,
              function_name: 'stake',
            },
            tx_result: { repr: 'u2000' },
          },
          {
            tx_id: 'tx-3',
            block_time: 2000,
            sender_address: 'SP789',
            contract_call: {
              contract_id: mockContractPrincipal,
              function_name: 'stake',
            },
            tx_result: { repr: 'u1500' },
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const events = await fetchContractEventStream(mockContractPrincipal);

      expect(events[0].timestamp).toBe(3000 * 1000);
      expect(events[1].timestamp).toBe(2000 * 1000);
      expect(events[2].timestamp).toBe(1000 * 1000);
    });
  });
});
