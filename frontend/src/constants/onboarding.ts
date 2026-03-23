export const ONBOARDING_STORAGE_KEYS = {
  FIRST_VISIT: 'sprintfund_first_visit',
  COMPLETED: 'sprintfund_onboarding_completed',
  STEPS: 'sprintfund_onboarding_steps',
} as const;

export const ONBOARDING_STEP_IDS = {
  WELCOME: 'welcome',
  WALLET_CONNECT: 'wallet-connect',
  STAKING: 'staking',
  PROPOSALS: 'proposals',
  VOTING: 'voting',
  DASHBOARD: 'dashboard',
} as const;

export const ONBOARDING_CONFIG = {
  TOTAL_STEPS: 6,
  AUTO_START_DELAY_MS: 500,
  TOOLTIP_ANIMATION_DURATION_MS: 300,
  CHECKLIST_POSITION: 'bottom-right',
} as const;
