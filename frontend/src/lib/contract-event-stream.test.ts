import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchContractEventStream,
  normalizeContractTransaction,
  type ContractTransaction,
} from './contract-event-stream';

describe('normalizeContractTransaction', () => {
  const contractPrincipal = 'SP1234567890.contract';

  it('maps a vote transaction into a readable event', () => {
    const tx: ContractTransaction = {
      tx_id: '0xabc',
      tx_type: 'contract_call',
      tx_status: 'success',
      sender_address: 'SP3TESTADDRESS1234567890',
      block_time_iso: '2026-04-21T00:00:00.000Z',
      event_count: 2,
      contract_call: {
        contract_id: contractPrincipal,
        function_name: 'vote',
        function_args: [
          { repr: 'u7', type: 'uint', name: 'proposal-id' },
          { repr: 'true', type: 'bool', name: 'support' },
          { repr: 'u5', type: 'uint', name: 'vote-weight' },
        ],
      },
    };

    const event = normalizeContractTransaction(tx, contractPrincipal);

    expect(event).not.toBeNull();
    expect(event?.category).toBe('vote');
    expect(event?.title).toBe('Vote recorded');
    expect(event?.summary).toContain('proposal #7');
    expect(event?.summary).toContain('weight 5');
    expect(event?.summary).toContain('yes');
    expect(event?.status).toBe('confirmed');
    expect(event?.eventCount).toBe(2);
  });

  it('returns null for non contract-call transactions', () => {
    const event = normalizeContractTransaction(
      {
        tx_id: '0xdef',
        tx_type: 'token_transfer',
        tx_status: 'success',
        sender_address: 'SP3TEST',
      },
      contractPrincipal,
    );

    expect(event).toBeNull();
  });

  it('returns null for another contract', () => {
    const event = normalizeContractTransaction(
      {
        tx_id: '0xghi',
        tx_type: 'contract_call',
        tx_status: 'success',
        sender_address: 'SP3TEST',
        contract_call: {
          contract_id: 'SP999.other-contract',
          function_name: 'vote',
          function_args: [{ repr: 'u1' }],
        },
      },
      contractPrincipal,
    );

    expect(event).toBeNull();
  });
});

describe('fetchContractEventStream', () => {
  const contractPrincipal = 'SP1234567890.contract';
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('fetches and sorts recent contract events', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              tx_id: '0x2',
              tx_type: 'contract_call',
              tx_status: 'success',
              sender_address: 'SP2',
              block_time_iso: '2026-04-21T01:00:00.000Z',
              contract_call: {
                contract_id: contractPrincipal,
                function_name: 'execute-proposal',
                function_args: [{ repr: 'u9' }],
              },
            },
            {
              tx_id: '0x1',
              tx_type: 'contract_call',
              tx_status: 'success',
              sender_address: 'SP1',
              block_time_iso: '2026-04-21T00:00:00.000Z',
              contract_call: {
                contract_id: contractPrincipal,
                function_name: 'create-proposal',
                function_args: [
                  { repr: 'u50000000' },
                  { repr: 'u"Community Grant"' },
                ],
              },
            },
            {
              tx_id: '0x3',
              tx_type: 'token_transfer',
              tx_status: 'success',
              sender_address: 'SP3',
            },
          ],
        }),
    });

    const events = await fetchContractEventStream({
      baseUrl: 'https://api.example.com',
      contractPrincipal,
      limit: 12,
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/extended/v1/address/SP1234567890.contract/transactions?limit=12&offset=0',
    );
    expect(events).toHaveLength(2);
    expect(events[0].txId).toBe('0x2');
    expect(events[0].category).toBe('execute');
    expect(events[1].txId).toBe('0x1');
    expect(events[1].summary).toContain('Community Grant');
  });
});

