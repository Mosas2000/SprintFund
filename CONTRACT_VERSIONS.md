# Contract Versioning Strategy

## Current Deployed Contracts

### Production (Mainnet)

| Version | Contract Name | Address | Status | Deployment Date |
|---------|---------------|---------|--------|----------------|
| v1 | `sprintfund-core` | `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core` | Deprecated | Initial deployment |
| v3 | `sprintfund-core-v3` | `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3` | **ACTIVE** | Current production version |

### Active Contract

**The frontend and all production systems currently use:**
- Contract: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3`
- Network: Mainnet

## Version Differences

### v1 (sprintfund-core)
- Initial production deployment
- Core DAO functionality: proposals, voting, staking
- Quadratic voting mechanism
- Reputation tracking

### v3 (sprintfund-core-v3)
- Enhanced version with improvements
- May include bug fixes or feature enhancements
- **Note**: Currently the active production contract

## Versioning Strategy

### 1. Semantic Contract Versioning

Contract versions follow a simplified semantic versioning scheme:
- **Major versions** (v1, v2, v3): Breaking changes requiring migration
- **Deployment naming**: `sprintfund-core` (production), `sprintfund-core-v{N}` (newer versions)

### 2. Version Migration Process

When deploying a new contract version:

1. **Deploy with version suffix**: Deploy as `sprintfund-core-v{N}`
2. **Testing**: Test thoroughly on testnet and devnet
3. **Documentation**: Document all changes in this file
4. **Migration plan**: Create migration strategy for state/users
5. **Update config**: Update `frontend/src/config.ts` with new contract name
6. **Coordinated deployment**: Update frontend and announce to users
7. **Monitor**: Track adoption and monitor for issues

### 3. Configuration Management

All contract references use centralized configuration:

**Single source of truth**: `contract-config.json` (root level)

```json
{
  "version": "3",
  "contract": {
    "address": "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T",
    "name": "sprintfund-core-v3",
    "principal": "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core-v3"
  }
}
```

All components and scripts import from this file via:
- Frontend: `frontend/src/config.ts` (reads from env with fallback to centralized config)
- Scripts: `scripts/lib/contract-config.js` (loads centralized config directly)

Run `npm run validate-config` to verify all config files are in sync.

### 4. Backward Compatibility

For forward compatibility considerations:

- **Contract traits**: Define interfaces for core functionality
- **Version detection**: Frontend can detect contract version via read-only calls
- **Graceful fallbacks**: Handle missing functions in older contracts
- **State migration**: Plan data migration for breaking changes

### 5. Testing Strategy

Before switching to a new contract version:

1. Deploy to devnet and run full test suite
2. Deploy to testnet and perform manual QA
3. Test migration path if applicable
4. Verify all frontend components work with new contract
5. Run security audit on changes
6. Document any API changes

## Version Switch Checklist

When ready to switch to a new version:

- [ ] Update `contract-config.json` with new contract details
- [ ] Run `npm run validate-config` to verify consistency
- [ ] Update documentation (README.md, frontend/README.md)
- [ ] Update deployment configs (`Clarinet.toml`, deployment plans)
- [ ] Update kubernetes configs if applicable
- [ ] Test all functionality end-to-end
- [ ] Update contract address in documentation
- [ ] Announce to community with migration guide if needed

## Current Status

**Frontend is using**: `sprintfund-core-v3` (v3)

**Recommendation**: The v3 contract is now in active use. Future migrations should:
1. Document specific improvements in newer versions
2. Test thoroughly
3. Create migration plan if state needs to be preserved
4. Update all references using the checklist above

## Monitoring

Track contract usage via:
- Stacks Explorer: https://explorer.hiro.so/address/{CONTRACT_PRINCIPAL}
- Contract read calls for version info
- Transaction volume per contract

## Contact

For questions about contract versioning, open an issue on GitHub.
