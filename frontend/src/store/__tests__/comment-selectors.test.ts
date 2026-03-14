import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import {
  useCommentCount,
  useProposalComments,
  useCommentSortOrder,
  useSetCommentSortOrder,
  useLoadComments,
  useAddComment,
  useEditComment,
  useDeleteComment,
  useToggleReaction,
  useUserCommentCount,
} from '../comment-selectors';

describe('comment selector exports', () => {
  it('exports useCommentCount', () => {
    expect(typeof useCommentCount).toBe('function');
  });

  it('exports useProposalComments', () => {
    expect(typeof useProposalComments).toBe('function');
  });

  it('exports useCommentSortOrder', () => {
    expect(typeof useCommentSortOrder).toBe('function');
  });

  it('exports useSetCommentSortOrder', () => {
    expect(typeof useSetCommentSortOrder).toBe('function');
  });

  it('exports useLoadComments', () => {
    expect(typeof useLoadComments).toBe('function');
  });

  it('exports useAddComment', () => {
    expect(typeof useAddComment).toBe('function');
  });

  it('exports useEditComment', () => {
    expect(typeof useEditComment).toBe('function');
  });

  it('exports useDeleteComment', () => {
    expect(typeof useDeleteComment).toBe('function');
  });

  it('exports useToggleReaction', () => {
    expect(typeof useToggleReaction).toBe('function');
  });

  it('exports useUserCommentCount', () => {
    expect(typeof useUserCommentCount).toBe('function');
  });
});
