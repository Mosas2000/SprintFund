import { describe, it, expect } from 'vitest';
import type {
  WsTransactionEvent,
  WsBlockEvent,
  ProposalUpdate,
  VoteUpdate,
  StakeUpdate,
  ConnectionStateUpdate,
} from './realtime';

describe('Real-time types', () => {
  describe('WsTransactionEvent', () => {
    it('represents a transaction event', () => {
      const event: WsTransactionEvent = {
        type: 'tx',
        data: {
          tx_id: 'abc' + '1'.repeat(61),
          tx_type: 'contract_call',
          tx_status: 'success',
          contract_call: {
            contract_id: 'ST000000000000000000002AMW42H.test',
            function_name: 'vote',
            function_args: [
              { repr: '(u 1)' },
              { repr: '(bool true)' },
            ],
          },
        },
      };

      expect(event.type).toBe('tx');
      expect(event.data.tx_status).toMatch(/^(success|pending|failed)$/);
    });
  });

  describe('WsBlockEvent', () => {
    it('represents a block event', () => {
      const event: WsBlockEvent = {
        type: 'block',
        data: {
          height: 100000,
          hash: 'abc' + '1'.repeat(61),
          burn_block_time: Date.now(),
        },
      };

      expect(event.type).toBe('block');
      expect(event.data.height).toBeGreaterThan(0);
    });
  });

  describe('ProposalUpdate', () => {
    it('represents real-time proposal update', () => {
      const update: ProposalUpdate = {
        proposalId: 1,
        status: 'voted',
        timestamp: Date.now(),
        data: {
          votesFor: 150,
          votesAgainst: 50,
        },
      };

      expect(update.status).toMatch(/^(created|voted|executed|failed)$/);
      expect(update.timestamp).toBeGreaterThan(0);
    });
  });

  describe('VoteUpdate', () => {
    it('represents real-time vote update', () => {
      const update: VoteUpdate = {
        proposalId: 1,
        voter: 'SP123456789',
        support: true,
        weight: 1000,
        timestamp: Date.now(),
      };

      expect(update.weight).toBeGreaterThan(0);
      expect(update.support).toBe(true);
    });
  });

  describe('StakeUpdate', () => {
    it('represents real-time stake update', () => {
      const update: StakeUpdate = {
        address: 'SP123456789',
        previousAmount: 1000000,
        newAmount: 2000000,
        change: 1000000,
        type: 'deposit',
        timestamp: Date.now(),
      };

      expect(update.type).toMatch(/^(deposit|withdraw)$/);
      expect(update.newAmount).toBeGreaterThan(update.previousAmount);
    });
  });

  describe('ConnectionStateUpdate', () => {
    it('represents connection state change', () => {
      const update: ConnectionStateUpdate = {
        state: 'connected',
        timestamp: Date.now(),
        attemptNumber: 1,
      };

      expect(update.state).toMatch(/^(connecting|connected|disconnected|error)$/);
    });

    it('includes error for failed state', () => {
      const update: ConnectionStateUpdate = {
        state: 'error',
        error: 'Connection refused',
        timestamp: Date.now(),
      };

      expect(update.error).toBeDefined();
    });
  });
});
