import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useCommentsStore } from '../comments';

describe('comments store initial state', () => {
  it('starts with empty commentsByProposal', () => {
    const state = useCommentsStore.getState();
    expect(state.commentsByProposal).toBeDefined();
    expect(typeof state.commentsByProposal).toBe('object');
  });

  it('starts with newest sort order', () => {
    const state = useCommentsStore.getState();
    expect(state.sortOrder).toBe('newest');
  });

  it('exposes loadComments action', () => {
    expect(typeof useCommentsStore.getState().loadComments).toBe('function');
  });

  it('exposes addComment action', () => {
    expect(typeof useCommentsStore.getState().addComment).toBe('function');
  });

  it('exposes editComment action', () => {
    expect(typeof useCommentsStore.getState().editComment).toBe('function');
  });

  it('exposes deleteComment action', () => {
    expect(typeof useCommentsStore.getState().deleteComment).toBe('function');
  });

  it('exposes setSortOrder action', () => {
    expect(typeof useCommentsStore.getState().setSortOrder).toBe('function');
  });

  it('exposes toggleReaction action', () => {
    expect(typeof useCommentsStore.getState().toggleReaction).toBe('function');
  });
});

describe('comments store sort order', () => {
  it('can change sort order to oldest', () => {
    useCommentsStore.getState().setSortOrder('oldest');
    expect(useCommentsStore.getState().sortOrder).toBe('oldest');
  });

  it('can change sort order back to newest', () => {
    useCommentsStore.getState().setSortOrder('newest');
    expect(useCommentsStore.getState().sortOrder).toBe('newest');
  });
});
