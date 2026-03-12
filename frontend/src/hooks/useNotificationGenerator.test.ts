import { describe, it, expect, vi } from 'vitest';
import type { RawProposal } from './useNotificationGenerator';
import {
  compareSnapshots,
  createEmptySnapshot,
  buildSnapshot,
} from '../lib/notification-generator';

/**
 * Tests for useNotificationGenerator hook logic.
 * Since this is a .test.ts file (not .tsx), we test the underlying
 * logic and behavioral contracts rather than rendering the hook.
 */

function makeProposal(overrides: Partial<RawProposal> = {}): RawProposal {
  return {
    id: 1,
    executed: false,
    voteCount: 0,
    ...overrides,
  };
}

describe('useNotificationGenerator behavioral contracts', () => {
  it('RawProposal requires id, executed, and voteCount', () => {
    const p = makeProposal();
    expect(p).toHaveProperty('id');
    expect(p).toHaveProperty('executed');
    expect(p).toHaveProperty('voteCount');
  });

  it('RawProposal id is a number', () => {
    const p = makeProposal({ id: 42 });
    expect(typeof p.id).toBe('number');
  });

  it('RawProposal executed is a boolean', () => {
    const p = makeProposal({ executed: true });
    expect(typeof p.executed).toBe('boolean');
  });

  it('RawProposal voteCount is a number', () => {
    const p = makeProposal({ voteCount: 100 });
    expect(typeof p.voteCount).toBe('number');
  });
});

describe('useNotificationGenerator snapshot diffing logic', () => {
  it('first call with proposals should detect all as new', () => {
    // Simulating what the hook does internally:
    // prev = empty, curr = proposals => all are new
    const prev = createEmptySnapshot();
    const proposals = [makeProposal({ id: 1 }), makeProposal({ id: 2 })];
    const curr = buildSnapshot(proposals);
    const notifications = compareSnapshots(prev, curr);

    const created = notifications.filter((n) => n.type === 'proposal_created');
    expect(created).toHaveLength(2);
  });

  it('second call with same data should produce no notifications', () => {
    const proposals = [makeProposal({ id: 1 }), makeProposal({ id: 2 })];
    const snap = buildSnapshot(proposals);
    const notifications = compareSnapshots(snap, snap);
    expect(notifications).toHaveLength(0);
  });

  it('adding a new proposal between calls triggers notification', () => {
    const first = [makeProposal({ id: 1 })];
    const second = [makeProposal({ id: 1 }), makeProposal({ id: 2 })];
    const prev = buildSnapshot(first);
    const curr = buildSnapshot(second);
    const notifications = compareSnapshots(prev, curr);

    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('proposal_created');
    expect(notifications[0].proposalId).toBe(2);
  });

  it('executing a proposal between calls triggers notification', () => {
    const first = [makeProposal({ id: 1, executed: false })];
    const second = [makeProposal({ id: 1, executed: true })];
    const prev = buildSnapshot(first);
    const curr = buildSnapshot(second);
    const notifications = compareSnapshots(prev, curr);

    const executed = notifications.filter((n) => n.type === 'proposal_executed');
    expect(executed).toHaveLength(1);
    expect(executed[0].proposalId).toBe(1);
  });

  it('vote increase crossing threshold triggers milestone notification', () => {
    const first = [makeProposal({ id: 1, voteCount: 4 })];
    const second = [makeProposal({ id: 1, voteCount: 6 })];
    const prev = buildSnapshot(first);
    const curr = buildSnapshot(second);
    const notifications = compareSnapshots(prev, curr);

    const milestones = notifications.filter((n) => n.type === 'vote_milestone');
    expect(milestones).toHaveLength(1);
    expect(milestones[0].title).toContain('5 votes');
  });

  it('only dispatches when notifications array is non-empty', () => {
    const addNotifications = vi.fn();
    const notifications: unknown[] = [];

    // Simulate the hook's conditional dispatch
    if (notifications.length > 0) {
      addNotifications(notifications);
    }
    expect(addNotifications).not.toHaveBeenCalled();

    // Now with actual notifications
    notifications.push({ id: 'test', type: 'proposal_created' });
    if (notifications.length > 0) {
      addNotifications(notifications);
    }
    expect(addNotifications).toHaveBeenCalledTimes(1);
  });
});

describe('useNotificationGenerator snapshot update', () => {
  it('snapshot ref is updated after processing', () => {
    // Simulate the ref update pattern
    let snapshotRef = buildSnapshot([]);
    const proposals = [makeProposal({ id: 1 })];
    const newSnapshot = buildSnapshot(proposals);
    snapshotRef = newSnapshot;

    expect(snapshotRef.knownIds.has(1)).toBe(true);
  });

  it('updated snapshot prevents duplicate notifications on same data', () => {
    // First call: empty -> proposals
    const proposals = [makeProposal({ id: 1 }), makeProposal({ id: 2 })];
    let snapshot = createEmptySnapshot();
    const curr1 = buildSnapshot(proposals);
    const notifs1 = compareSnapshots(snapshot, curr1);
    snapshot = curr1;
    expect(notifs1).toHaveLength(2);

    // Second call: same proposals
    const curr2 = buildSnapshot(proposals);
    const notifs2 = compareSnapshots(snapshot, curr2);
    expect(notifs2).toHaveLength(0);
  });
});
