# Stacks Network Import Migration Guide

## Overview
The `@stacks/network` package deprecated the `StacksMainnet` class in favor of a singleton constant `STACKS_MAINNET`. This migration updates all imports across the project to use the new approach.

## Why This Change?
- **Compatibility**: Future versions of `@stacks/network` may remove the deprecated classes entirely
- **Performance**: Singleton constants are more efficient than instantiated classes
- **Consistency**: Aligns with Stacks documentation and best practices
- **Simplicity**: Removes unnecessary object instantiation boilerplate

## Changes Made

### JavaScript/Node Scripts
Updated the following files to use `STACKS_MAINNET`:
- `scripts/call-logger.js`
- `scripts/deploy-logger.js`
- `scripts/stake.js`
- `scripts/create-proposal.js`

Each file had 2-3 references to `new StacksMainnet()` which were replaced with direct references to `STACKS_MAINNET`.

### Configuration Files
Added TypeScript utilities for network configuration:
- `frontend/src/config/stacks-network.ts` - Network configuration constants
- `frontend/src/utils/stacks-network-migration.ts` - Migration mapping and type definitions
- `frontend/src/utils/stacks-network-init.ts` - Network initialization functions
- `frontend/src/utils/stacks-migration-examples.ts` - Before/after migration examples

## Migration Pattern

### Before (Deprecated)
```typescript
import { StacksMainnet } from '@stacks/network';

const network = new StacksMainnet();
const txOptions = {
  network: network,
  // ... other options
};
const result = await broadcastTransaction(transaction, network);
```

### After (Current)
```typescript
import { STACKS_MAINNET } from '@stacks/network';

const txOptions = {
  network: STACKS_MAINNET,
  // ... other options
};
const result = await broadcastTransaction(transaction, STACKS_MAINNET);
```

## Key Improvements
1. No instantiation needed - use constant directly
2. Reduces boilerplate code
3. Better tree-shaking by bundlers
4. Future-proof against package updates
5. Consistent with Stacks ecosystem standards

## Implementation Details

### Direct Constant Usage
```javascript
const { STACKS_MAINNET } = require('@stacks/network');
// Use STACKS_MAINNET directly
```

### In ES Module Files
```typescript
import { STACKS_MAINNET } from '@stacks/network';
// Use STACKS_MAINNET directly
```

### Network Configuration
The new utilities provide:
- `getStacksNetwork()` - Get network based on environment
- `initializeStacksNetwork()` - Initialize and validate network
- `getNetworkUrl()` - Get network API URL
- `getNetworkChainId()` - Get network chain ID
- `validateNetworkConfig()` - Validate network configuration

## Backwards Compatibility
This change is backwards compatible:
- Old code using `new StacksMainnet()` still works
- Both import patterns are valid during the deprecation period
- No breaking changes to application functionality
- All existing tests pass

## Future Considerations
- Monitor `@stacks/network` releases for class removal
- Consider adding similar migrations for testnet if needed
- Update documentation to reflect new pattern
- Consider adding ESLint rules to prevent new deprecated usage

## Testing
To verify the migration:
```bash
# Check that all scripts still work
npm run stake
npm run create-proposal
npm run call-logger

# Verify types in TypeScript files
npx tsc --noEmit

# Run existing tests
npm test
```

## Additional Resources
- [Stacks Documentation](https://docs.stacks.co/)
- [@stacks/network Package](https://github.com/hirosystems/stacks.js)
- [Migration Notes](https://github.com/hirosystems/stacks.js/blob/master/CHANGELOG.md)
