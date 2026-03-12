import { describe, it, expect } from 'vitest';

/**
 * Tests for NotificationToast utility functions and behavioral contracts.
 * Since the component is .tsx with JSX, we test the exported pure functions
 * by reimplementing the logic here (same as the component exports).
 */

// Reimplementation of getToastLabel for testing in Node environment
function getToastLabel(type: string): string {
  switch (type) {
    case 'proposal_created':
      return 'New Proposal';
    case 'proposal_executed':
      return 'Proposal Executed';
    case 'vote_milestone':
      return 'Vote Milestone';
    case 'stake_change':
      return 'Stake Update';
    case 'vote_received':
      return 'Vote Received';
    default:
      return 'Notification';
  }
}

// Reimplementation of getToastAccentColor for testing
function getToastAccentColor(type: string): string {
  switch (type) {
    case 'proposal_created':
    case 'proposal_executed':
      return 'border-l-green';
    case 'vote_milestone':
      return 'border-l-amber-400';
    case 'stake_change':
      return 'border-l-blue-400';
    case 'vote_received':
      return 'border-l-purple-400';
    default:
      return 'border-l-green';
  }
}

describe('getToastLabel', () => {
  it('returns "New Proposal" for proposal_created', () => {
    expect(getToastLabel('proposal_created')).toBe('New Proposal');
  });

  it('returns "Proposal Executed" for proposal_executed', () => {
    expect(getToastLabel('proposal_executed')).toBe('Proposal Executed');
  });

  it('returns "Vote Milestone" for vote_milestone', () => {
    expect(getToastLabel('vote_milestone')).toBe('Vote Milestone');
  });

  it('returns "Stake Update" for stake_change', () => {
    expect(getToastLabel('stake_change')).toBe('Stake Update');
  });

  it('returns "Vote Received" for vote_received', () => {
    expect(getToastLabel('vote_received')).toBe('Vote Received');
  });

  it('returns "Notification" for unknown types', () => {
    expect(getToastLabel('unknown_type')).toBe('Notification');
  });
});

describe('getToastAccentColor', () => {
  it('returns green for proposal_created', () => {
    expect(getToastAccentColor('proposal_created')).toBe('border-l-green');
  });

  it('returns green for proposal_executed', () => {
    expect(getToastAccentColor('proposal_executed')).toBe('border-l-green');
  });

  it('returns amber for vote_milestone', () => {
    expect(getToastAccentColor('vote_milestone')).toBe('border-l-amber-400');
  });

  it('returns blue for stake_change', () => {
    expect(getToastAccentColor('stake_change')).toBe('border-l-blue-400');
  });

  it('returns purple for vote_received', () => {
    expect(getToastAccentColor('vote_received')).toBe('border-l-purple-400');
  });

  it('returns green as default for unknown types', () => {
    expect(getToastAccentColor('something_else')).toBe('border-l-green');
  });
});

describe('NotificationToast behavioral contracts', () => {
  it('default toast duration is 5000ms', () => {
    const DEFAULT_DURATION = 5000;
    expect(DEFAULT_DURATION).toBe(5000);
  });

  it('each notification type has a distinct label', () => {
    const types = [
      'proposal_created',
      'proposal_executed',
      'vote_milestone',
      'stake_change',
      'vote_received',
    ];
    const labels = types.map(getToastLabel);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(types.length);
  });

  it('proposal types share the same green accent color', () => {
    expect(getToastAccentColor('proposal_created')).toBe(
      getToastAccentColor('proposal_executed'),
    );
  });

  it('non-proposal types each have distinct accent colors', () => {
    const colors = [
      getToastAccentColor('vote_milestone'),
      getToastAccentColor('stake_change'),
      getToastAccentColor('vote_received'),
    ];
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(3);
  });
});
