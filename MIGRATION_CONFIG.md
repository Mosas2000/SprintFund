# Configuration Migration Guide

This guide helps you understand and work with the new centralized configuration system.

## What Changed

Previously, contract configuration was scattered across multiple files:
- `frontend/src/config.ts` - Hardcoded values
- `frontend/config.ts` - Different hardcoded values
- `.env.example` - Only had address
- Scripts - Hardcoded values in each file

Now, all configuration is centralized in `contract-config.json`.

## Migration Steps

### For Developers

1. **Update your environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Run validation**:
   ```bash
   cd scripts
   npm run validate-config
   ```

3. **Update scripts**:
   - All scripts now import from `scripts/lib/contract-config.js`
   - No manual updates needed unless adding new scripts

### For Maintainers

When updating contract configuration:

1. Edit `contract-config.json` with new values
2. Run `npm run validate-config` to check consistency
3. Update any documentation that references the old values
4. Commit the changes

## Files Updated

The following files were updated to use the centralized config:

- `frontend/src/config.ts` - Now imports from centralized config
- `frontend/config.ts` - Fixed to use correct contract name
- `scripts/create-proposal.js` - Uses centralized config
- `scripts/stake.js` - Uses centralized config
- `scripts/call-logger.js` - Uses centralized config
- `scripts/withdraw-legacy.js` - Uses centralized config
- `create-test-proposal.sh` - Loads from centralized config
- `.env.example` - Now includes contract name

## Rollback Plan

If you need to rollback:

1. The old hardcoded values are preserved in git history
2. You can revert the config files individually
3. Environment variables still work as overrides

## Support

For questions about the configuration system:
- Check `CONFIGURATION.md` for detailed documentation
- Run `npm run validate-config` to check for issues
- Open an issue on GitHub if you encounter problems
