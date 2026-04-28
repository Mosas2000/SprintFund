# Configuration System Changelog

## [1.0.0] - 2026-04-28

### Added
- Centralized contract configuration file (`contract-config.json`)
- Configuration loader utilities for JavaScript and TypeScript
- Validation script to check config consistency across files
- Update script to propagate config changes
- Comprehensive documentation (CONFIGURATION.md, MIGRATION_CONFIG.md)
- TypeScript definitions for config loader
- Unit tests for config loader functions
- GitHub Actions workflow for automated validation
- Helper functions for network and legacy contract management

### Changed
- Updated `frontend/src/config.ts` to use centralized config as fallback
- Fixed `frontend/config.ts` to use correct contract name (v3)
- Updated all scripts to load from centralized config:
  - `scripts/create-proposal.js`
  - `scripts/stake.js`
  - `scripts/call-logger.js`
  - `scripts/withdraw-legacy.js`
- Updated `create-test-proposal.sh` to load from centralized config
- Updated `.env.example` to include contract name
- Updated `CONTRACT_VERSIONS.md` to reference centralized config
- Updated `scripts/README.md` with configuration section

### Fixed
- Contract name drift between root and src config files
- Hardcoded contract values in multiple scripts
- Missing contract name in environment example
- Inconsistent configuration across the codebase

### Benefits
- Single source of truth prevents configuration drift
- Easy updates by changing one file
- Automated validation catches mismatches
- Clear documentation for configuration management
- Type-safe configuration access
- Reduced maintenance burden for version updates
