/**
 * Onboarding System Usage Guide
 *
 * The onboarding system helps first-time users learn about SprintFund's core features
 * through an interactive tour, tooltips, and a getting-started checklist.
 *
 * Key Files:
 * - store/onboarding.ts: State management for onboarding
 * - providers/OnboardingProvider.tsx: Provider component that wraps the app
 * - hooks/useOnboarding.ts: Hook for accessing onboarding state
 * - hooks/useOnboardingActions.ts: Hook for marking steps as complete
 * - components/OnboardingModal.tsx: Interactive tour modal
 * - components/OnboardingTooltip.tsx: Tooltip component for tour steps
 * - components/OnboardingChecklist.tsx: Progress checklist widget
 * - components/OnboardingGuide.tsx: Getting started guide
 * - config/onboarding-tour.ts: Tour steps and DAO concept definitions
 * - utils/first-time-visitor.ts: Utilities for detecting first-time visitors
 */

/**
 * Using the Onboarding Hook in Components
 *
 * Example: Mark a step as complete when wallet is connected
 */
import { useOnboarding } from '../hooks/useOnboarding';

export function WalletConnectButton() {
  const { completeStep, isStepCompleted } = useOnboarding();

  const handleConnect = async () => {
    await connectWallet();
    completeStep('wallet-connect');
  };

  return (
    <button onClick={handleConnect}>
      {isStepCompleted('wallet-connect') ? 'Connected' : 'Connect Wallet'}
    </button>
  );
}

/**
 * Using the Onboarding Actions Hook
 *
 * Example: Automatically complete wallet connection step
 */
import { useOnboardingActions } from '../hooks/useOnboardingActions';

export function DashboardPage() {
  const { markDashboardViewed } = useOnboardingActions();

  useEffect(() => {
    markDashboardViewed();
  }, [markDashboardViewed]);

  return <Dashboard />;
}

/**
 * Onboarding Steps Available:
 * - 'welcome': Initial welcome message
 * - 'wallet-connect': Wallet connection step
 * - 'staking': Staking explanation
 * - 'proposals': Proposals browsing
 * - 'voting': Voting mechanics
 * - 'dashboard': Dashboard overview
 */

/**
 * Checking Onboarding Status
 */
import { useOnboarding } from '../hooks/useOnboarding';

export function OnboardingStatus() {
  const {
    isFirstTime,
    currentStep,
    completedSteps,
    getCompletionPercentage,
  } = useOnboarding();

  return (
    <div>
      <p>First time visitor: {isFirstTime ? 'Yes' : 'No'}</p>
      <p>Current step: {currentStep}</p>
      <p>Completed: {completedSteps.join(', ')}</p>
      <p>Progress: {getCompletionPercentage()}%</p>
    </div>
  );
}

/**
 * Resetting Onboarding (Development/Testing)
 */
import { useOnboardingDebug } from '../hooks/useOnboardingDebug';

export function OnboardingReset() {
  const { resetAndRestart, getOnboardingStatus, clearAllOnboardingData } =
    useOnboardingDebug();

  return (
    <div>
      <button onClick={resetAndRestart}>Reset and Restart</button>
      <button onClick={clearAllOnboardingData}>Clear All Data</button>
      <pre>{JSON.stringify(getOnboardingStatus(), null, 2)}</pre>
    </div>
  );
}

/**
 * DAO Concept Tooltips
 *
 * The onboarding system includes explanations of key DAO concepts
 * that appear throughout the tour. These are defined in:
 * config/onboarding-tour.ts under the DAO_CONCEPTS object
 *
 * Concepts included:
 * - Governance
 * - Voting Power
 * - Tokenomics
 * - Delegation
 * - Quadratic Voting
 * - STX Token
 */

/**
 * Storage Keys
 *
 * The onboarding system uses these localStorage keys:
 * - 'sprintfund_first_visit': Tracks if this is first visit (with timestamp)
 * - 'sprintfund_onboarding_completed': Flag indicating onboarding completion
 * - 'sprintfund_onboarding_steps': JSON array of completed step IDs
 */

/**
 * Integration Points
 *
 * The OnboardingProvider is integrated at the top level in main.tsx
 * It automatically:
 * 1. Detects first-time visitors
 * 2. Displays the onboarding modal on first visit
 * 3. Shows the progress checklist
 * 4. Tracks completed steps
 * 5. Persists progress to localStorage
 */
