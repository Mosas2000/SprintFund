import { useEffect } from 'react';
import { useOnboarding } from './useOnboarding';
import { useWalletStore } from '../store/wallet';

export function useOnboardingAutoComplete() {
  const {
    completeStep,
    isStepCompleted,
  } = useOnboarding();

  const isWalletConnected = useWalletStore((s) => s.isConnected);

  useEffect(() => {
    if (isWalletConnected && !isStepCompleted('wallet-connect')) {
      completeStep('wallet-connect');
    }
  }, [isWalletConnected, isStepCompleted, completeStep]);

  const markProposalsPageViewed = () => {
    if (!isStepCompleted('proposals')) {
      completeStep('proposals');
    }
  };

  const markVotingPageViewed = () => {
    if (!isStepCompleted('voting')) {
      completeStep('voting');
    }
  };

  const markDashboardPageViewed = () => {
    if (!isStepCompleted('dashboard')) {
      completeStep('dashboard');
    }
  };

  const markStakingStarted = () => {
    if (!isStepCompleted('staking')) {
      completeStep('staking');
    }
  };

  return {
    markProposalsPageViewed,
    markVotingPageViewed,
    markDashboardPageViewed,
    markStakingStarted,
  };
}
