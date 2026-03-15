import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { useCommentsStore } from '../comments';
import type { Comment } from '../../types/comment';

describe('comments store addComment', () => {
  beforeEach(() => {
    useCommentsStore.setState({ commentsByProposal: {}, sortOrder: 'newest' });
  });

  it('adds a comment to a proposal', () => {
    const comment: Comment = {
      id: 'c1',
      proposalId: 1,
      author: 'SP1TEST',
      text: 'Great proposal',
      createdAt: Date.now(),
      deleted: false,
      reactions: {},
    };

    useCommentsStore.getState().addComment(1, comment);

    const comments = useCommentsStore.getState().commentsByProposal[1];
    expect(comments).toHaveLength(1);
    expect(comments[0].text).toBe('Great proposal');
  });

  it('adds multiple comments to same proposal', () => {
    const c1: Comment = { id: 'c1', proposalId: 1, author: 'SP1', text: 'First', createdAt: 100, deleted: false, reactions: {} };
    const c2: Comment = { id: 'c2', proposalId: 1, author: 'SP2', text: 'Second', createdAt: 200, deleted: false, reactions: {} };

    useCommentsStore.getState().addComment(1, c1);
    useCommentsStore.getState().addComment(1, c2);

    const comments = useCommentsStore.getState().commentsByProposal[1];
    expect(comments).toHaveLength(2);
  });

  it('keeps comments isolated per proposal', () => {
    const c1: Comment = { id: 'c1', proposalId: 1, author: 'SP1', text: 'On P1', createdAt: 100, deleted: false, reactions: {} };
    const c2: Comment = { id: 'c2', proposalId: 2, author: 'SP1', text: 'On P2', createdAt: 200, deleted: false, reactions: {} };

    useCommentsStore.getState().addComment(1, c1);
    useCommentsStore.getState().addComment(2, c2);

    expect(useCommentsStore.getState().commentsByProposal[1]).toHaveLength(1);
    expect(useCommentsStore.getState().commentsByProposal[2]).toHaveLength(1);
  });
});

describe('comments store deleteComment', () => {
  beforeEach(() => {
    const c1: Comment = { id: 'c1', proposalId: 1, author: 'SP1', text: 'Delete me', createdAt: 100, deleted: false, reactions: {} };
    useCommentsStore.setState({ commentsByProposal: { 1: [c1] }, sortOrder: 'newest' });
  });

  it('marks a comment as deleted', () => {
    useCommentsStore.getState().deleteComment(1, 'c1');
    const comment = useCommentsStore.getState().commentsByProposal[1].find(c => c.id === 'c1');
    expect(comment?.deleted).toBe(true);
  });
});

import { beforeEach } from 'vitest';
