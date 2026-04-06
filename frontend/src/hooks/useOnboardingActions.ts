import { useOnboarding } from '../hooks/useOnboarding';
import { useCallback, useEffect } from 'react';
import { useWalletStore } from '../store/wallet';

export function useOnboardingActions() {
  const { completeStep, isStepCompleted } = useOnboarding();
  const isConnected = useWalletStore((s) => s.connected);

  useEffect(() => {
    if (isConnected && !isStepCompleted('wallet-connect')) {
      completeStep('wallet-connect');
    }
  }, [isConnected, completeStep, isStepCompleted]);

  const markWalletConnected = useCallback(() => {
    completeStep('wallet-connect');
  }, [completeStep]);

  const markStakingStarted = useCallback(() => {
    completeStep('staking');
  }, [completeStep]);

  const markProposalsViewed = useCallback(() => {
    completeStep('proposals');
  }, [completeStep]);

  const markVotingCompleted = useCallback(() => {
    completeStep('voting');
  }, [completeStep]);

  const markDashboardViewed = useCallback(() => {
    completeStep('dashboard');
  }, [completeStep]);

  return {
    markWalletConnected,
    markStakingStarted,
    markProposalsViewed,
    markVotingCompleted,
    markDashboardViewed,
  };
}
