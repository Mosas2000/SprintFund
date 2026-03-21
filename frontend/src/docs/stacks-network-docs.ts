export const StacksNetworkDocumentation = `
# Stacks Network Migration Documentation

## Quick Reference

### Old (Deprecated)
\`\`\`javascript
import { StacksMainnet } from '@stacks/network';
const network = new StacksMainnet();
\`\`\`

### New (Current)
\`\`\`javascript
import { STACKS_MAINNET } from '@stacks/network';
// Use STACKS_MAINNET directly
\`\`\`

## Why This Change?

1. **Simpler API**: No need for class instantiation
2. **Better Performance**: Singleton constant vs class instances
3. **Future Proof**: Aligns with @stacks/network 5.0+ standards
4. **Consistency**: Matches Stacks ecosystem conventions

## Common Patterns

### Transaction Submission
\`\`\`typescript
import { STACKS_MAINNET } from '@stacks/network';
import { makeContractCall, broadcastTransaction } from '@stacks/transactions';

const txOptions = {
  contractAddress: 'SP...',
  contractName: 'my-contract',
  functionName: 'my-function',
  functionArgs: [],
  senderKey: process.env.PRIVATE_KEY,
  network: STACKS_MAINNET,
};

const transaction = await makeContractCall(txOptions);
const result = await broadcastTransaction(transaction, STACKS_MAINNET);
\`\`\`

### Network Information
\`\`\`typescript
import { STACKS_MAINNET } from '@stacks/network';

const apiUrl = STACKS_MAINNET.coreApiUrl;
const chainId = STACKS_MAINNET.chainId;
const bnsUrl = STACKS_MAINNET.bnsLookupUrl;
\`\`\`

## Files Updated in Migration

- scripts/call-logger.js
- scripts/deploy-logger.js
- scripts/stake.js
- scripts/create-proposal.js

## New Support Files

### Utilities
- frontend/src/config/stacks-network.ts
- frontend/src/providers/stacks-network.ts
- frontend/src/services/stacks-api-client.ts
- frontend/src/hooks/useStacksNetwork.ts

### Type Definitions
- frontend/src/types/stacks-network.ts

### Validators
- frontend/src/utils/stacks-network-validator.ts

### Migration Helpers
- frontend/src/utils/stacks-network-migration.ts
- frontend/src/utils/stacks-network-init.ts
- frontend/src/utils/stacks-network-mocks.ts

### Constants & Examples
- frontend/src/constants/stacks-network-constants.ts
- frontend/src/utils/stacks-migration-examples.ts
- frontend/src/utils/migration-checklist.ts

## Testing

All existing tests should pass without modification. The change is backwards compatible during the deprecation period.

## Resources

- [@stacks/network Documentation](https://docs.stacks.co/)
- [Migration Guide](./STACKS_MAINNET_MIGRATION.md)
`;

export default StacksNetworkDocumentation;
