import { describe, it, expect } from 'vitest';
import { VOTE_HISTORY_FILTERS } from './select-values';
import type {
  BudgetPeriod,
  ReportPeriod,
  ExpenseStatus,
  ExpenseType,
  PaymentStatus,
  PaymentType,
  PaymentEntityType,
  RecurringInterval,
  GrantStatus,
  DependencyType,
  ContributorRole,
  RelationshipFilter,
  ReputationFilter,
  DigestMode,
  VoteHistoryFilter,
} from './select-values';

describe('Select value types', () => {
  describe('BudgetPeriod', () => {
    it('accepts monthly', () => {
      const period: BudgetPeriod = 'monthly';
      expect(period).toBe('monthly');
    });

    it('accepts quarterly', () => {
      const period: BudgetPeriod = 'quarterly';
      expect(period).toBe('quarterly');
    });
  });

  describe('ReportPeriod', () => {
    it('accepts all three period options', () => {
      const periods: ReportPeriod[] = ['monthly', 'quarterly', 'annual'];
      expect(periods).toHaveLength(3);
    });
  });

  describe('ExpenseStatus', () => {
    it('includes all filter with status values', () => {
      const statuses: ExpenseStatus[] = ['all', 'pending', 'approved', 'rejected', 'paid'];
      expect(statuses).toHaveLength(5);
    });
  });

  describe('ExpenseType', () => {
    it('includes all filter with expense type values', () => {
      const types: ExpenseType[] = [
        'all', 'grant_payout', 'operational',
        'infrastructure', 'marketing', 'community', 'other',
      ];
      expect(types).toHaveLength(7);
    });
  });

  describe('PaymentStatus', () => {
    it('includes all filter with payment status values', () => {
      const statuses: PaymentStatus[] = [
        'all', 'scheduled', 'processing', 'completed', 'failed',
      ];
      expect(statuses).toHaveLength(5);
    });
  });

  describe('PaymentType', () => {
    it('includes all filter with payment type values', () => {
      const types: PaymentType[] = ['all', 'milestone', 'recurring', 'one-time'];
      expect(types).toHaveLength(4);
    });
  });

  describe('PaymentEntityType', () => {
    it('excludes the all filter value', () => {
      const types: PaymentEntityType[] = ['milestone', 'recurring', 'one-time'];
      expect(types).toHaveLength(3);
    });
  });

  describe('RecurringInterval', () => {
    it('has three interval options', () => {
      const intervals: RecurringInterval[] = ['weekly', 'monthly', 'quarterly'];
      expect(intervals).toHaveLength(3);
    });
  });

  describe('GrantStatus', () => {
    it('includes all filter with grant status values', () => {
      const statuses: GrantStatus[] = [
        'all', 'active', 'completed', 'delayed', 'cancelled',
      ];
      expect(statuses).toHaveLength(5);
    });
  });

  describe('DependencyType', () => {
    it('has three dependency type values', () => {
      const types: DependencyType[] = ['requires', 'blocks', 'follows'];
      expect(types).toHaveLength(3);
    });
  });

  describe('ContributorRole', () => {
    it('has three role values', () => {
      const roles: ContributorRole[] = ['author', 'reviewer', 'supporter'];
      expect(roles).toHaveLength(3);
    });
  });

  describe('RelationshipFilter', () => {
    it('has three filter values', () => {
      const filters: RelationshipFilter[] = ['all', 'mutual', 'following'];
      expect(filters).toHaveLength(3);
    });
  });

  describe('ReputationFilter', () => {
    it('has three filter values', () => {
      const filters: ReputationFilter[] = ['all', 'high', 'medium'];
      expect(filters).toHaveLength(3);
    });
  });

  describe('DigestMode', () => {
    it('has three digest mode values', () => {
      const modes: DigestMode[] = ['instant', 'daily', 'weekly'];
      expect(modes).toHaveLength(3);
    });
  });

  describe('VoteHistoryFilter', () => {
    it('has three uppercase filter values', () => {
      const filters: VoteHistoryFilter[] = ['ALL', 'YES', 'NO'];
      expect(filters).toHaveLength(3);
    });
  });

  describe('VOTE_HISTORY_FILTERS', () => {
    it('is a readonly array of vote history filter values', () => {
      expect(VOTE_HISTORY_FILTERS).toEqual(['ALL', 'YES', 'NO']);
    });

    it('has exactly 3 elements', () => {
      expect(VOTE_HISTORY_FILTERS).toHaveLength(3);
    });

    it('preserves literal union types', () => {
      const first: VoteHistoryFilter = VOTE_HISTORY_FILTERS[0];
      expect(first).toBe('ALL');
    });
  });

  describe('type safety for select onChange handlers', () => {
    it('BudgetPeriod narrows from string correctly', () => {
      const value = 'monthly' as string;
      const isBudgetPeriod = (v: string): v is BudgetPeriod =>
        v === 'monthly' || v === 'quarterly';

      expect(isBudgetPeriod(value)).toBe(true);
      expect(isBudgetPeriod('invalid')).toBe(false);
    });

    it('ExpenseStatus narrows from string correctly', () => {
      const validStatuses = ['all', 'pending', 'approved', 'rejected', 'paid'];
      const isExpenseStatus = (v: string): v is ExpenseStatus =>
        validStatuses.includes(v);

      expect(isExpenseStatus('pending')).toBe(true);
      expect(isExpenseStatus('unknown')).toBe(false);
    });

    it('VoteHistoryFilter narrows from string correctly', () => {
      const isVoteFilter = (v: string): v is VoteHistoryFilter =>
        VOTE_HISTORY_FILTERS.includes(v as VoteHistoryFilter);

      expect(isVoteFilter('ALL')).toBe(true);
      expect(isVoteFilter('MAYBE')).toBe(false);
    });
  });
});
