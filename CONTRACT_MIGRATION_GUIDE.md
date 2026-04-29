# Contract Migration Guide

## Overview

This guide explains how to migrate between different versions of the SprintFund smart contract. Contract migrations are necessary when deploying new versions with breaking changes or significant improvements.

## Understanding Contract Versions

SprintFund uses versioned smart contracts deployed on the Stacks blockchain. Each version is immutable once deployed, so migrations involve:

1. Deploying a new contract version
2. Migrating user state (if possible)
3. Updating frontend configuration
4. Guiding users through the transition

## What Moves Between Versions

### Automatically Migrated

**Nothing is automatically migrated.** Smart contracts on Stacks are immutable and independent. Each contract maintains its own state.

### User-Initiated Migration

Users must manually migrate their assets:

- **Staked STX**: Users withdraw from old contract, re-stake in new contract
- **Voting power**: Recalculated based on new stake in new contract
- **Reputation**: May be preserved via migration script or reset

### Immutable (Cannot Move)

The following remain tied to the original contract:

- **Proposal history**: All proposals remain in their original contract
- **Vote records**: Historical votes are preserved in old contract
- **Transaction history**: Blockchain history is permanent
- **Treasury funds**: Locked in original contract unless explicitly transferred

## Migration Types

### Type 1: Non-Breaking Enhancement

**Scenario**: Bug fixes, optimizations, new optional features

**Impact**: Low - users can continue using old contract

**Process**:
1. Deploy new contract version
2. Update frontend to use new contract
3. Announce migration window
4. Users migrate at their convenience
5. Old contract remains functional

### Type 2: Breaking Change

**Scenario**: Core logic changes, security fixes, incompatible updates

**Impact**: High - old contract should be deprecated

**Process**:
1. Deploy new contract version
2. Test thoroughly on testnet
3. Create migration scripts
4. Announce deprecation timeline
5. Provide migration tools
6. Update frontend with migration prompts
7. Monitor adoption
8. Eventually disable old contract interactions in UI

### Type 3: Emergency Migration

**Scenario**: Critical security vulnerability discovered

**Impact**: Critical - immediate action required

**Process**:
1. Deploy patched contract immediately
2. Pause old contract if possible
3. Alert all users via all channels
4. Provide expedited migration path
5. Update frontend immediately
6. Monitor for exploitation attempts

## State Preservation Risks

### Risk 1: Lost Reputation

**Issue**: Reputation scores are stored in contract state and cannot be automatically transferred.

**Mitigation**:
- Create snapshot of reputation before migration
- Provide migration script that reads old contract state
- Allow users to claim reputation in new contract
- Require proof of ownership (signature verification)

### Risk 2: Locked Funds

**Issue**: Staked STX in old contract must be manually withdrawn.

**Mitigation**:
- Clear UI warnings about withdrawal requirement
- Provide one-click migration tool
- Monitor for stuck funds
- Extend withdrawal period if needed

### Risk 3: In-Flight Proposals

**Issue**: Active proposals in old contract cannot be moved.

**Mitigation**:
- Announce migration before proposal deadline
- Allow proposals to complete in old contract
- Provide grace period for execution
- Document which proposals are in which contract

### Risk 4: Vote Lock Conflicts

**Issue**: Users with locked votes cannot immediately migrate.

**Mitigation**:
- Display lock expiration clearly
- Allow migration after lock expires
- Consider emergency unlock for critical migrations
- Provide estimated migration date per user

## User Migration Flow

### Step 1: Detection

Frontend detects user has assets in old contract:

```typescript
const hasLegacyStake = await checkLegacyStake(userAddress);
const hasLegacyReputation = await checkLegacyReputation(userAddress);
```

### Step 2: Notification

Display migration banner:

```
⚠️ Contract Migration Available
You have 100 STX staked in the previous contract version.
Migrate now to continue participating in governance.
[Migrate Now] [Learn More]
```

### Step 3: Pre-Migration Check

Verify user can migrate:

- Check for active vote locks
- Verify withdrawal eligibility
- Calculate migration costs (gas fees)
- Show what will be preserved vs. reset

### Step 4: Migration Execution

Execute migration transaction:

1. Withdraw stake from old contract
2. Re-stake in new contract
3. Claim reputation (if applicable)
4. Verify migration success

### Step 5: Confirmation

Show migration results:

```
✓ Migration Complete
- Migrated: 100 STX
- New voting power: 10 votes
- Reputation: Preserved
- Gas cost: 0.015 STX
```

## Operator Migration Checklist

### Pre-Migration (1-2 weeks before)

- [ ] Deploy new contract to testnet
- [ ] Run full test suite against new contract
- [ ] Perform security audit
- [ ] Create migration scripts
- [ ] Test migration scripts on testnet
- [ ] Document all changes in CHANGELOG
- [ ] Update CONTRACT_VERSIONS.md
- [ ] Create user-facing migration guide
- [ ] Prepare announcement materials
- [ ] Set migration timeline

### Migration Day

- [ ] Deploy new contract to mainnet
- [ ] Verify deployment success
- [ ] Update contract-config.json
- [ ] Run config validation
- [ ] Deploy frontend update
- [ ] Verify frontend connects to new contract
- [ ] Test migration flow end-to-end
- [ ] Announce migration to community
- [ ] Monitor for issues
- [ ] Provide support in community channels

### Post-Migration (1-2 weeks after)

- [ ] Monitor adoption rate
- [ ] Track migration transactions
- [ ] Identify users needing assistance
- [ ] Address any migration issues
- [ ] Update documentation based on feedback
- [ ] Plan deprecation of old contract UI
- [ ] Archive old contract data
- [ ] Document lessons learned

## Rollback Procedures

### When to Rollback

Rollback if:
- Critical bug discovered in new contract
- Migration causing widespread issues
- Significant user funds at risk
- Adoption rate extremely low due to problems

### Rollback Process

1. **Immediate**: Revert frontend to old contract
   ```bash
   git revert <migration-commit>
   npm run deploy
   ```

2. **Communication**: Announce rollback immediately
   - Explain reason for rollback
   - Provide timeline for fix
   - Reassure users about fund safety

3. **Investigation**: Identify root cause
   - Review contract code
   - Analyze failed transactions
   - Gather user feedback

4. **Resolution**: Fix issues
   - Patch contract if needed
   - Update migration scripts
   - Re-test thoroughly

5. **Retry**: Attempt migration again
   - Deploy fixed version
   - Communicate changes
   - Monitor closely

### Rollback Limitations

**Cannot rollback**:
- Blockchain transactions (immutable)
- User migrations already completed
- Funds already moved to new contract

**Can rollback**:
- Frontend configuration
- UI migration prompts
- Recommended contract version
- Documentation

## Migration Scripts

### Check Legacy Balance

```bash
node scripts/check-legacy-balance.js --address <user-address>
```

### Migrate User Stake

```bash
node scripts/migrate-stake.js --amount <microSTX>
```

### Batch Migration Report

```bash
node scripts/migration-report.js --output report.json
```

## Frontend Migration UI

The frontend automatically detects contract versions and guides users through migration:

### Components

- `MigrationBanner`: Persistent notification about available migration
- `MigrationModal`: Step-by-step migration wizard
- `MigrationStatus`: Shows migration progress and results
- `LegacyContractWarning`: Warns when viewing old contract data

### User Experience

1. User logs in with wallet
2. Frontend checks for legacy contract assets
3. If found, displays migration banner
4. User clicks "Migrate Now"
5. Modal shows migration details and risks
6. User confirms migration
7. Transactions execute automatically
8. Success confirmation displayed

## Monitoring Migration Progress

### Metrics to Track

- Total users with legacy assets
- Migration completion rate
- Average migration time
- Failed migration attempts
- Gas costs per migration
- Support tickets related to migration

### Tools

- Stacks Explorer for transaction monitoring
- Custom analytics dashboard
- Migration status API endpoint
- Community feedback channels

## Communication Plan

### Announcement Channels

1. **GitHub**: Release notes and migration guide
2. **Discord/Telegram**: Direct user communication
3. **Twitter**: Public announcement
4. **Email**: Direct notification to known users
5. **In-app**: Banner and modal notifications

### Message Template

```
SprintFund Contract Migration - Action Required

We've deployed an improved version of the SprintFund contract with [key improvements].

What you need to do:
1. Visit app.sprintfund.xyz
2. Click "Migrate Now" when prompted
3. Confirm the migration transaction
4. Your stake and reputation will be preserved

Timeline:
- Migration available: [Date]
- Old contract UI disabled: [Date + 30 days]
- Support ends: [Date + 60 days]

Questions? Visit our migration guide: [link]
```

## FAQ

### Do I have to migrate?

Yes, to continue participating in governance with the latest features and security improvements.

### Will I lose my staked STX?

No, you will withdraw from the old contract and re-stake in the new one. Your STX remains yours.

### What happens to my reputation?

Reputation is preserved through the migration process using cryptographic proof of ownership.

### Can I migrate if I have active votes?

You must wait for your vote locks to expire before migrating.

### How much will migration cost?

Approximately 0.015-0.03 STX in transaction fees.

### What if I don't migrate?

You can still withdraw your stake from the old contract, but you won't be able to participate in new governance activities.

### Is my proposal history preserved?

Yes, all historical data remains on the blockchain and viewable in explorers.

## Support

For migration assistance:
- GitHub Issues: [link]
- Discord: [link]
- Email: support@sprintfund.xyz

## Version History

- v1 → v3: Initial production migration (current)
- Future migrations will be documented here
