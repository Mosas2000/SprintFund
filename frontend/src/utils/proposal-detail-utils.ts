import type { ProposalDiscussionComment } from '../types/proposal-detail';

interface ProposalWithVotingEnd {
  status?: 'approved' | 'rejected' | 'pending';
  votingEnd?: string;
}

export class ProposalDetailUtils {
  static formatAddress(address: string): string {
    return `${address.slice(0, 12)}...${address.slice(-6)}`;
  }

  static formatSTX(microSTX: number): string {
    const stx = microSTX / 1_000_000;
    return stx.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  static calculateVotingPercentage(votes: number, total: number): number {
    if (total === 0) return 0;
    return (votes / total) * 100;
  }

  static getVotingStatus(proposal: ProposalWithVotingEnd): 'active' | 'ended' | 'approved' | 'rejected' {
    if (proposal.status === 'approved') return 'approved';
    if (proposal.status === 'rejected') return 'rejected';

    if (proposal.votingEnd) {
      const votingEnd = new Date(proposal.votingEnd);
      if (votingEnd < new Date()) return 'ended';
    }

    return 'active';
  }

  static getRemainingDays(votingEnd: string): number {
    const end = new Date(votingEnd);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  static getStatusColor(status: string): {
    bg: string;
    text: string;
    border: string;
  } {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-green-500/20',
          text: 'text-green-400',
          border: 'border-green-500/30',
        };
      case 'rejected':
        return {
          bg: 'bg-red-500/20',
          text: 'text-red-400',
          border: 'border-red-500/30',
        };
      case 'pending':
      default:
        return {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30',
        };
    }
  }

  static sortCommentsByDate(comments: ProposalDiscussionComment[], order: 'asc' | 'desc' = 'desc'): ProposalDiscussionComment[] {
    return comments.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  static filterCommentsByContent(comments: ProposalDiscussionComment[], query: string): ProposalDiscussionComment[] {
    const lowerQuery = query.toLowerCase();
    return comments.filter((c) =>
      c.content.toLowerCase().includes(lowerQuery) ||
      c.authorName?.toLowerCase().includes(lowerQuery)
    );
  }
}
