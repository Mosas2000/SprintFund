import { useCallback, useReducer } from 'react';
import { useConnect, UserSession } from '@stacks/connect-react';
import { proposalDiscussionService } from '@/services/proposal-discussion';
import { ProposalDiscussionThread } from '@/types/proposal-detail';

// Helper to safely get user address from UserSession
function getUserAddress(userSession: UserSession | null): string | null {
  if (!userSession) return null;
  try {
    const userData = userSession.loadUserData?.();
    return userData?.profile?.stxAddress?.mainnet || null;
  } catch {
    return null;
  }
}

// Helper to safely get user name from UserSession
function getUserName(userSession: UserSession | null): string | undefined {
  if (!userSession) return undefined;
  try {
    const userData = userSession.loadUserData?.();
    return userData?.profile?.name;
  } catch {
    return undefined;
  }
}

export function useProposalDiscussion(proposalId: string) {
  const { userSession } = useConnect();
  const [refreshKey, triggerRefresh] = useReducer((value: number) => value + 1, 0);
  void refreshKey;
  const thread: ProposalDiscussionThread | null = (() => {
    if (!proposalId) return null;
    return proposalDiscussionService.getDiscussionThread(proposalId);
  })();

  const addComment = useCallback(
    (content: string) => {
      const address = getUserAddress(userSession);
      if (!address) return null;

      const comment = proposalDiscussionService.addComment(
        proposalId,
        address,
        content,
        getUserName(userSession)
      );

      triggerRefresh();

      return comment;
    },
    [proposalId, userSession]
  );

  const addReply = useCallback(
    (parentCommentId: string, content: string) => {
      const address = getUserAddress(userSession);
      if (!address) return null;

      const reply = proposalDiscussionService.addReply(
        proposalId,
        parentCommentId,
        address,
        content,
        getUserName(userSession)
      );

      triggerRefresh();

      return reply;
    },
    [proposalId, userSession]
  );

  const editComment = useCallback(
    (commentId: string, newContent: string) => {
      const success = proposalDiscussionService.editComment(proposalId, commentId, newContent);

      if (success) {
        triggerRefresh();
      }

      return success;
    },
    [proposalId]
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      const success = proposalDiscussionService.deleteComment(proposalId, commentId);

      if (success) {
        triggerRefresh();
      }

      return success;
    },
    [proposalId]
  );

  const likeComment = useCallback(
    (commentId: string) => {
      const success = proposalDiscussionService.likeComment(proposalId, commentId);

      if (success) {
        triggerRefresh();
      }

      return success;
    },
    [proposalId]
  );

  return {
    thread,
    addComment,
    addReply,
    editComment,
    deleteComment,
    likeComment,
  };
}
