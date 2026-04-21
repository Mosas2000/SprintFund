export const INTEGRATION_CHECKLIST = [
  {
    task: 'ContractEventStream component',
    details: 'Display real-time contract events with filtering',
    status: 'complete',
  },
  {
    task: 'Event type definitions',
    details: 'TypeScript types for contract events',
    status: 'complete',
  },
  {
    task: 'Event normalization',
    details: 'Convert Stacks API transactions to readable events',
    status: 'complete',
  },
  {
    task: 'Event filtering',
    details: 'Filter events by category and status',
    status: 'complete',
  },
  {
    task: 'GovernanceNotificationManager',
    details: 'Global notification system manager',
    status: 'complete',
  },
  {
    task: 'NotificationPreferencesModal',
    details: 'User settings for notification types',
    status: 'complete',
  },
  {
    task: 'NotificationDisplay components',
    details: 'Toast and dropdown notification UIs',
    status: 'complete',
  },
  {
    task: 'Notification hooks',
    details: 'useNotifications, useContractEvents, useGovernanceEventNotifications',
    status: 'complete',
  },
  {
    task: 'Preference persistence',
    details: 'localStorage-based preference storage',
    status: 'complete',
  },
  {
    task: 'Event monitoring',
    details: 'Contract event polling with callbacks',
    status: 'complete',
  },
  {
    task: 'Notification deduplication',
    details: 'Prevent duplicate notifications within time window',
    status: 'complete',
  },
  {
    task: 'Analytics and utilities',
    details: 'Event grouping, stats, filtering, sorting',
    status: 'complete',
  },
  {
    task: 'Root layout integration',
    details: 'GovernanceNotificationManager in layout.tsx',
    status: 'complete',
  },
  {
    task: 'Dashboard integration',
    details: 'ContractEventStream in GovernanceAnalyticsDashboard',
    status: 'complete',
  },
  {
    task: 'Unit tests',
    details: '25+ tests covering all major functionality',
    status: 'complete',
  },
  {
    task: 'Documentation',
    details: 'GOVERNANCE_FEATURES.md with full API reference',
    status: 'complete',
  },
];

export const FEATURE_265_IMPLEMENTATION = {
  issue: '#265: Live Contract Event Stream',
  components: [
    'ContractEventStream.tsx',
    'EventAnalyticsPanel.tsx',
  ],
  libraries: [
    'contract-events.ts',
    'event-utilities.ts',
  ],
  tests: [
    'contract-events.test.ts',
    'event-utilities.test.ts',
  ],
  types: [
    'contract-events.ts',
  ],
};

export const FEATURE_259_IMPLEMENTATION = {
  issue: '#259: Governance Notifications',
  components: [
    'GovernanceNotificationManager.tsx',
    'NotificationPreferencesModal.tsx',
    'NotificationDisplay.tsx',
    'NotificationList.tsx',
    'NotificationCenterDropdown.tsx',
  ],
  libraries: [
    'governance-notifications.ts',
    'governance-notification-preferences.ts',
    'notification-utilities.ts',
    'governance-config.ts',
  ],
  tests: [
    'governance-notifications.test.ts',
    'governance-notification-preferences.test.ts',
    'notification-utilities.test.ts',
    'useContractEvents.test.ts',
  ],
  hooks: [
    'useNotifications.ts',
    'useContractEvents.ts',
    'useGovernanceEventNotifications.ts',
  ],
  types: [
    'notifications.ts',
  ],
};
