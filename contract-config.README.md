# Contract Configuration File

This file (`contract-config.json`) is the single source of truth for all contract configuration in the SprintFund project.

## Structure

```json
{
  "version": "3",                    // Contract version number
  "contract": {
    "address": "SP...",              // Stacks contract address
    "name": "sprintfund-core-v3",    // Contract name
    "principal": "SP....contract"    // Full principal (address.name)
  },
  "network": {
    "default": "mainnet",            // Default network
    "mainnet": { ... },              // Mainnet API endpoints
    "testnet": { ... }               // Testnet API endpoints
  },
  "legacy": {                        // Legacy contract versions
    "v1": { ... },
    "v2": { ... }
  }
}
```

## Usage

### Frontend (TypeScript)
```typescript
import { config } from './lib/contract-config';
const address = config.contract.address;
```

### Scripts (JavaScript)
```javascript
import { getContractAddress } from './lib/contract-config.js';
const address = getContractAddress();
```

### Shell Scripts
```bash
CONTRACT_ADDRESS=$(jq -r '.contract.address' contract-config.json)
```

## Updating

When updating contract configuration:

1. Edit `contract-config.json`
2. Run `npm run validate-config` to verify
3. Commit the changes
4. All scripts and frontend will automatically use new values

## Validation

Run validation to check for config drift:
```bash
cd scripts
npm run validate-config
```

This checks that all files reference the correct contract values.

## Environment Overrides

Environment variables can override config values:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_CONTRACT_NAME`
- `NEXT_PUBLIC_NETWORK`

## See Also

- `CONFIGURATION.md` - Detailed configuration documentation
- `MIGRATION_CONFIG.md` - Migration guide for the config system
- `CONTRACT_VERSIONS.md` - Contract versioning strategy
