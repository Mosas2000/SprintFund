import { useCallback, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { proposalDiscussionService } from '@/services/proposal-discussion';
import { ProposalDiscussionThread, ProposalDiscussionComment } from '@/types/proposal-detail';

export function useProposalDiscussion(proposalId: string) {
  const { userSession } = useConnect();
  const [thread, setThread] = useState<ProposalDiscussionThread | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proposalId) {
      const discussion = proposalDiscussionService.getDiscussionThread(proposalId);
      setThread(discussion);
    }
  }, [proposalId]);

  const addComment = useCallback(
    (content: string) => {
      if (!userSession) return null;

      const address = userSession.addresses.mainnet;
      const comment = proposalDiscussionService.addComment(
        proposalId,
        address,
        content,
        userSession.profile?.name
      );

      const updated = proposalDiscussionService.getDiscussionThread(proposalId);
      setThread(updated);

      return comment;
    },
    [proposalId, userSession]
  );

  const addReply = useCallback(
    (parentCommentId: string, content: string) => {
      if (!userSession) return null;

      const address = userSession.addresses.mainnet;
      const reply = proposalDiscussionService.addReply(
        proposalId,
        parentCommentId,
        address,
        content,
        userSession.profile?.name
      );

      const updated = proposalDiscussionService.getDiscussionThread(proposalId);
      setThread(updated);

      return reply;
    },
    [proposalId, userSession]
  );

  const editComment = useCallback(
    (commentId: string, newContent: string) => {
      const success = proposalDiscussionService.editComment(proposalId, commentId, newContent);

      if (success) {
        const updated = proposalDiscussionService.getDiscussionThread(proposalId);
        setThread(updated);
      }

      return success;
    },
    [proposalId]
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      const success = proposalDiscussionService.deleteComment(proposalId, commentId);

      if (success) {
        const updated = proposalDiscussionService.getDiscussionThread(proposalId);
        setThread(updated);
      }

      return success;
    },
    [proposalId]
  );

  const likeComment = useCallback(
    (commentId: string) => {
      const success = proposalDiscussionService.likeComment(proposalId, commentId);

      if (success) {
        const updated = proposalDiscussionService.getDiscussionThread(proposalId);
        setThread(updated);
      }

      return success;
    },
    [proposalId]
  );

  return {
    thread,
    loading,
    addComment,
    addReply,
    editComment,
    deleteComment,
    likeComment,
  };
}
