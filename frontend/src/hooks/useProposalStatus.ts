import { useMemo } from 'react';
import type { Proposal } from '../types/proposal';
import { getProposalStatus, type ProposalStatusInfo } from '../lib/proposal-status';
import { useCurrentBlockHeight } from './useCurrentBlockHeight';

export function useProposalStatus(proposal: Proposal | null): ProposalStatusInfo | null {
  const { blockHeight } = useCurrentBlockHeight();

  return useMemo(() => {
    if (!proposal || !blockHeight) {
      return null;
    }
    return getProposalStatus(proposal, blockHeight);
  }, [proposal, blockHeight]);
}
