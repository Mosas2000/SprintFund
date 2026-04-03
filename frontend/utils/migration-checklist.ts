export const MIGRATION_CHECKLIST = {
  codeChanges: [
    'Replace StacksMainnet imports with STACKS_MAINNET',
    'Remove all new StacksMainnet() instantiations',
    'Update network parameter in transaction options',
    'Update broadcastTransaction calls to use STACKS_MAINNET',
    'Remove intermediate network variables where possible',
  ],
  testing: [
    'Run all existing unit tests',
    'Run integration tests with mainnet',
    'Verify transaction broadcasts work correctly',
    'Check network configuration is correct',
    'Validate error handling for network issues',
  ],
  documentation: [
    'Update README with new import pattern',
    'Create migration guide for other developers',
    'Add comments explaining STACKS_MAINNET usage',
    'Document network configuration options',
    'Add examples to codebase comments',
  ],
  validation: [
    'Verify all scripts still run correctly',
    'Check that network API calls work',
    'Validate chain ID is correct',
    'Ensure BNS lookup URL is valid',
    'Test error scenarios and recovery',
  ],
};

export const MIGRATION_STATUS = {
  scripts: {
    'call-logger.js': 'COMPLETED',
    'deploy-logger.js': 'COMPLETED',
    'stake.js': 'COMPLETED',
    'create-proposal.js': 'COMPLETED',
  },
  utilities: {
    'stacks-network.ts': 'CREATED',
    'stacks-network-migration.ts': 'CREATED',
    'stacks-network-init.ts': 'CREATED',
    'stacks-migration-examples.ts': 'CREATED',
    'stacks-network-validator.ts': 'CREATED',
    'stacks-network-mocks.ts': 'CREATED',
    'stacks-network-constants.ts': 'CREATED',
  },
  documentation: {
    'STACKS_MAINNET_MIGRATION.md': 'CREATED',
  },
};
