import { describe, it, expect } from 'vitest';

/**
 * Barrel export validation tests.
 *
 * Ensures that all profile components and types are accessible through
 * their respective barrel files so consumers can rely on the documented
 * import paths.
 */

describe('components/profile barrel exports', () => {
  it('exports ProfileHeader', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.ProfileHeader).toBeDefined();
    expect(typeof mod.ProfileHeader).toBe('object'); // memo returns an object
  });

  it('exports ProfileStatsGrid', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.ProfileStatsGrid).toBeDefined();
  });

  it('exports UserProposals', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.UserProposals).toBeDefined();
  });

  it('exports VotingHistory', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.VotingHistory).toBeDefined();
  });

  it('exports ActivityTimeline', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.ActivityTimeline).toBeDefined();
  });

  it('exports ProfileSkeleton', async () => {
    const mod = await import('../components/profile/index');
    expect(mod.ProfileSkeleton).toBeDefined();
  });

  it('exports exactly six components', async () => {
    const mod = await import('../components/profile/index');
    const keys = Object.keys(mod);
    expect(keys).toHaveLength(6);
    expect(keys.sort()).toEqual([
      'ActivityTimeline',
      'ProfileHeader',
      'ProfileSkeleton',
      'ProfileStatsGrid',
      'UserProposals',
      'VotingHistory',
    ]);
  });
});

describe('types/profile re-exports through types.ts', () => {
  it('re-exports ActivityEventType', async () => {
    // Type-only re-exports cannot be tested at runtime, but the module
    // should resolve without error and contain the value exports.
    const mod = await import('../types');
    expect(mod).toBeDefined();
  });

  it('re-exports COMMENT_RULES constant', async () => {
    const mod = await import('../types');
    expect(mod.COMMENT_RULES).toBeDefined();
    expect(typeof mod.COMMENT_RULES.maxLength).toBe('number');
  });
});

describe('profile-data public API surface', () => {
  it('exports fetchUserProfile', async () => {
    const mod = await import('../lib/profile-data');
    expect(typeof mod.fetchUserProfile).toBe('function');
  });

  it('exports saveVoteRecord', async () => {
    const mod = await import('../lib/profile-data');
    expect(typeof mod.saveVoteRecord).toBe('function');
  });

  it('exports getLocalVoteHistory', async () => {
    const mod = await import('../lib/profile-data');
    expect(typeof mod.getLocalVoteHistory).toBe('function');
  });

  it('does not leak internal helpers', async () => {
    const mod = await import('../lib/profile-data') as Record<string, unknown>;
    // formatMicroStx, computeStats, etc. should remain private
    expect(mod.formatMicroStx).toBeUndefined();
    expect(mod.computeStats).toBeUndefined();
    expect(mod.buildActivityFromProposals).toBeUndefined();
  });
});
