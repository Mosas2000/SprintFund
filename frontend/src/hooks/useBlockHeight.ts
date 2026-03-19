import { useMemo } from 'react';
import type { Proposal } from '../types';
import { formatBlockHeight, formatBlockHeightShort, getBlockTimestampEstimate } from '../lib/block-height';

interface UseBlockHeightResult {
  formattedFull: string;
  formattedShort: string;
  estimatedTimestamp: number | null;
  displayedTime: string;
}

export function useBlockHeight(blockHeight: number | null | undefined): UseBlockHeightResult {
  return useMemo(() => {
    const formattedFull = formatBlockHeight(blockHeight);
    const formattedShort = formatBlockHeightShort(blockHeight);
    const estimatedTimestamp = getBlockTimestampEstimate(blockHeight);

    return {
      formattedFull,
      formattedShort,
      estimatedTimestamp,
      displayedTime: formattedFull,
    };
  }, [blockHeight]);
}

export function useProposalBlockHeight(proposal: Proposal | null): UseBlockHeightResult {
  return useBlockHeight(proposal?.createdAt);
}
