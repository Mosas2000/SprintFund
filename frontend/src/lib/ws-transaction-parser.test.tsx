import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseWsTransaction } from './ws-transaction-parser';
import type { WsMessage } from '../types/notification';
import { CONTRACT_PRINCIPAL } from '../config';

beforeEach(() => {
  vi.resetModules();
});

function makeTxMessage(overrides: Partial<WsMessage['payload']> = {}): WsMessage {
  return {
    event: 'transaction',
    payload: {
      tx_id: '0xabc123',
      tx_type: 'contract_call',
      tx_status: 'success',
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'create-proposal',
        function_args: [],
      },
      ...overrides,
    },
  };
}

describe('parseWsTransaction', () => {
  it('returns null for non-transaction events', () => {
    const msg: WsMessage = { event: 'block', payload: {} };
    expect(parseWsTransaction(msg, null)).toBeNull();
  });

  it('returns null when there is no contract_call', () => {
    const msg: WsMessage = {
      event: 'transaction',
      payload: { tx_id: '0x1', tx_status: 'success' },
    };
    expect(parseWsTransaction(msg, null)).toBeNull();
  });

  it('returns null when tx_status is not success', () => {
    const msg = makeTxMessage({ tx_status: 'pending' });
    expect(parseWsTransaction(msg, null)).toBeNull();
  });

  it('returns null when contract_id does not match', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: 'SP000.other-contract',
        function_name: 'create-proposal',
        function_args: [],
      },
    });
    expect(parseWsTransaction(msg, null)).toBeNull();
  });

  it('detects create-proposal as proposal_created', () => {
    const msg = makeTxMessage();
    const result = parseWsTransaction(msg, null);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('proposal_created');
    expect(result!.txId).toBe('0xabc123');
  });

  it('detects vote-for as vote_received', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'vote-for',
        function_args: [{ repr: 'u5' }],
      },
    });
    const result = parseWsTransaction(msg, null);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('vote_received');
    expect(result!.proposalId).toBe(5);
  });

  it('detects vote-against as vote_received', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'vote-against',
        function_args: [{ repr: 'u10' }],
      },
    });
    const result = parseWsTransaction(msg, null);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('vote_received');
    expect(result!.proposalId).toBe(10);
  });

  it('detects execute-proposal as proposal_executed', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'execute-proposal',
        function_args: [{ repr: 'u3' }],
      },
    });
    const result = parseWsTransaction(msg, null);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('proposal_executed');
    expect(result!.proposalId).toBe(3);
  });

  it('returns null for unknown function names', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'unknown-function',
        function_args: [],
      },
    });
    expect(parseWsTransaction(msg, null)).toBeNull();
  });

  it('handles missing function_args gracefully', () => {
    const msg = makeTxMessage({
      contract_call: {
        contract_id: CONTRACT_PRINCIPAL,
        function_name: 'vote-for',
        function_args: [],
      },
    });
    const result = parseWsTransaction(msg, null);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('vote_received');
  });
});
