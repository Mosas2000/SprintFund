export interface ProposalDiscussionComment {
  id: string;
  authorAddress: string;
  authorName?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: ProposalDiscussionComment[];
  isEdited: boolean;
  isDeleted: boolean;
}

export interface ProposalDiscussionThread {
  proposalId: string;
  comments: ProposalDiscussionComment[];
  totalComments: number;
  lastCommentAt?: string;
}

export interface ProposalExecutionStatus {
  status: 'pending' | 'executing' | 'completed' | 'failed';
  transactionId?: string;
  blockHeight?: number;
  executedAt?: string;
  errorMessage?: string;
}

export interface ProposalVotingAnalytics {
  totalVotes: number;
  approveVotes: number;
  rejectVotes: number;
  approvePercentage: number;
  rejectPercentage: number;
  uniqueVoters: number;
  topVoters: Array<{
    address: string;
    votes: number;
    percentage: number;
  }>;
  votingTrend: Array<{
    timestamp: string;
    approveCount: number;
    rejectCount: number;
  }>;
}

export interface ProposalDetailData {
  proposal: any;
  votingHistory: any[];
  discussion: ProposalDiscussionThread;
  executionStatus: ProposalExecutionStatus;
  relatedProposals: any[];
  votingAnalytics: ProposalVotingAnalytics;
}
