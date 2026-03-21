export const STACKS_NETWORK_CONSTANTS = {
  MAINNET: {
    DEPRECATED_IMPORT: 'import { StacksMainnet } from "@stacks/network"',
    CURRENT_IMPORT: 'import { STACKS_MAINNET } from "@stacks/network"',
    DEPRECATED_USAGE: 'const network = new StacksMainnet()',
    CURRENT_USAGE: 'Use STACKS_MAINNET directly',
  },
  TESTNET: {
    DEPRECATED_IMPORT: 'import { StacksTestnet } from "@stacks/network"',
    CURRENT_IMPORT: 'import { STACKS_TESTNET } from "@stacks/network"',
    DEPRECATED_USAGE: 'const network = new StacksTestnet()',
    CURRENT_USAGE: 'Use STACKS_TESTNET directly',
  },
} as const;

export const NETWORK_DEPRECATION_WARNING = `
⚠️  DEPRECATION WARNING:
The StacksMainnet class is deprecated in @stacks/network >= 5.0.0
Use the STACKS_MAINNET constant instead.

Before: import { StacksMainnet } from "@stacks/network"
After:  import { STACKS_MAINNET } from "@stacks/network"

See STACKS_MAINNET_MIGRATION.md for detailed migration guide.
`;

export const printDeprecationWarning = () => {
  console.warn(NETWORK_DEPRECATION_WARNING);
};
