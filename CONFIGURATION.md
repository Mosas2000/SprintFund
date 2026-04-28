# Configuration Management

## Centralized Contract Configuration

This project uses a centralized configuration system to prevent drift between contract settings across different files.

### Single Source of Truth

The `contract-config.json` file at the project root is the single source of truth for all contract configuration:

```json
{
  "version": "3",
  "contract": {
    "address": "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T",
    "name": "sprintfund-core-v3",
    "principal": "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3"
  },
  "network": {
    "default": "mainnet",
    "mainnet": { "apiUrl": "...", "explorerUrl": "..." },
    "testnet": { "apiUrl": "...", "explorerUrl": "..." }
  }
}
```

### How It Works

1. **Root config file**: `contract-config.json` contains all contract settings
2. **Frontend**: `frontend/src/config.ts` loads from centralized config with env override support
3. **Scripts**: `scripts/lib/contract-config.js` loads centralized config directly
4. **Validation**: `scripts/validate-config.js` verifies all files are in sync

### Environment Variables

Environment variables can override centralized config values:

- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Override contract address
- `NEXT_PUBLIC_CONTRACT_NAME` - Override contract name
- `NEXT_PUBLIC_NETWORK` - Override network (mainnet/testnet)
- `NEXT_PUBLIC_STACKS_API_URL` - Override API URL

### Validation

Run the validation script to check for config drift:

```bash
cd scripts
npm run validate-config
```

This will:
- Load the centralized config
- Check all config files for consistency
- Report any mismatches
- Exit with error code if issues found

### Adding New Config Values

1. Add the value to `contract-config.json`
2. Update the TypeScript loader (`frontend/src/lib/contract-config.ts`)
3. Update the JavaScript loader (`scripts/lib/contract-config.js`)
4. Update any files that use the new value
5. Run validation to verify

### Migration from Hardcoded Values

All hardcoded contract addresses and names have been replaced with references to the centralized config:

- ✅ `frontend/src/config.ts` - Uses centralized config
- ✅ `frontend/config.ts` - Uses centralized config
- ✅ `scripts/create-proposal.js` - Uses centralized config
- ✅ `scripts/stake.js` - Uses centralized config
- ✅ `scripts/call-logger.js` - Uses centralized config
- ✅ `scripts/withdraw-legacy.js` - Uses centralized config
- ✅ `create-test-proposal.sh` - Loads from centralized config
- ✅ `.env.example` - Includes contract name

### Benefits

- **No more drift**: Single source of truth prevents inconsistencies
- **Easy updates**: Change once in `contract-config.json`
- **Validation**: Automated checks catch mismatches
- **Documentation**: Clear structure for all config values
- **Type safety**: TypeScript definitions for config structure
