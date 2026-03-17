import { describe, it, expect } from 'vitest';
import { compareSnapshots, createEmptySnapshot } from './notification-generator';
import type { ProposalSnapshot, QuorumConfig } from '../types/notification';

describe('quorum detection in compareSnapshots', () => {
  it('emits quorum_reached when votes cross the quorum threshold', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 40]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 55]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const quorum = notifications.filter((n) => n.type === 'quorum_reached');
    expect(quorum).toHaveLength(1);
    expect(quorum[0].proposalId).toBe(1);
    expect(quorum[0].title).toContain('quorum');
  });

  it('does not emit quorum_reached when already above threshold', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 60]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 70]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const quorum = notifications.filter((n) => n.type === 'quorum_reached');
    expect(quorum).toHaveLength(0);
  });

  it('does not emit quorum_reached when votes do not reach threshold', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 10]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 30]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const quorum = notifications.filter((n) => n.type === 'quorum_reached');
    expect(quorum).toHaveLength(0);
  });

  it('uses custom quorum threshold', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 5]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 15]]),
    };
    const customQuorum: QuorumConfig = { threshold: 10 };
    const notifications = compareSnapshots(prev, curr, undefined, customQuorum);
    const quorum = notifications.filter((n) => n.type === 'quorum_reached');
    expect(quorum).toHaveLength(1);
  });

  it('emits quorum for new proposal that arrives above threshold', () => {
    const prev = createEmptySnapshot();
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 60]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const quorum = notifications.filter((n) => n.type === 'quorum_reached');
    expect(quorum).toHaveLength(1);
  });

  it('emits both milestone and quorum when both thresholds cross', () => {
    const prev: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 45]]),
    };
    const curr: ProposalSnapshot = {
      knownIds: new Set([1]),
      executedIds: new Set(),
      voteTotals: new Map([[1, 55]]),
    };
    const notifications = compareSnapshots(prev, curr);
    const types = notifications.map((n) => n.type);
    expect(types).toContain('vote_milestone');
    expect(types).toContain('quorum_reached');
  });
});
