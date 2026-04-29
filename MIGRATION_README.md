# Contract Migration System

## Overview

This directory contains comprehensive documentation and tooling for managing contract version migrations in SprintFund. The migration system ensures smooth transitions between contract versions while preserving user assets and minimizing disruption.

## Documentation

### For Users

- **[User Migration Guide](./USER_MIGRATION_GUIDE.md)** - Step-by-step instructions for migrating your assets
- **[Migration FAQ](./MIGRATION_FAQ.md)** - Answers to common questions about migration

### For Operators

- **[Contract Migration Guide](./CONTRACT_MIGRATION_GUIDE.md)** - Comprehensive technical guide for planning and executing migrations
- **[Operator Migration Runbook](./OPERATOR_MIGRATION_RUNBOOK.md)** - Detailed procedures for migration day operations
- **[Migration Timeline Template](./MIGRATION_TIMELINE_TEMPLATE.md)** - Template for planning migration schedules

### For Risk Management

- **[Migration State Risks](./MIGRATION_STATE_RISKS.md)** - Detailed risk assessment and mitigation strategies

## Migration Tools

### Scripts

Located in `scripts/`:

#### Check Legacy Balance

Check if a user has assets in legacy contract versions:

```bash
node scripts/check-legacy-balance.js --address <user-address>
```

Options:
- `--address <principal>` - User address to check (required)
- `--network <name>` - Network to use (mainnet/testnet, default: mainnet)
- `--version <v1|v2>` - Legacy version to check (default: v1)
- `--json` - Output in JSON format

#### Migrate Stake

Automate the migration process for a user:

```bash
node scripts/migrate-stake.js --amount <microSTX>
```

Options:
- `--amount <microSTX>` - Amount to migrate (required)
- `--from-version <v1|v2>` - Legacy version to migrate from (default: v1)
- `--network <name>` - Network to use (mainnet/testnet, default: mainnet)
- `--claim-reputation` - Also claim reputation from legacy contract
- `--dry-run` - Show transaction details without broadcasting
- `--skip-confirm` - Skip confirmation prompt on mainnet

#### Migration Report

Generate a report of migration status across all users:

```bash
node scripts/migration-report.js --addresses users.txt
```

Options:
- `--addresses <file>` - File containing user addresses (one per line)
- `--network <name>` - Network to use (mainnet/testnet, default: mainnet)
- `--version <v1|v2>` - Legacy version to check (default: v1)
- `--output <file>` - Output file for report (default: migration-report.json)
- `--format <json|csv>` - Output format (default: json)

### Frontend Components

Located in `frontend/src/components/`:

#### MigrationBanner

Persistent notification about available migration:

```tsx
import { MigrationBanner } from '../components/MigrationBanner';

<MigrationBanner
  userAddress={userAddress}
  onMigrateClick={() => setShowModal(true)}
  onDismiss={() => setDismissed(true)}
/>
```

#### MigrationModal

Step-by-step migration wizard:

```tsx
import { MigrationModal } from '../components/MigrationModal';

<MigrationModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  userAddress={userAddress}
/>
```

#### MigrationStatus

Display migration status and eligibility:

```tsx
import { MigrationStatus } from '../components/MigrationStatus';

<MigrationStatus userAddress={userAddress} />
```

#### VersionMismatchWarning

Alert users to version mismatches:

```tsx
import { VersionMismatchWarning } from '../components/VersionMismatchWarning';

<VersionMismatchWarning />
```

### Hooks

Located in `frontend/src/hooks/`:

#### useLegacyBalance

Check if user has assets in legacy contracts:

```tsx
import { useLegacyBalance } from '../hooks/useLegacyBalance';

const legacyBalance = useLegacyBalance(userAddress, 'v1');

if (legacyBalance.hasLegacyAssets) {
  // Show migration prompt
}
```

Returns:
- `hasLegacyAssets` - Whether user has assets in legacy contract
- `stakedAmount` - Amount staked in microSTX
- `stakedSTX` - Amount staked in STX
- `reputation` - User's reputation score
- `hasActiveLocks` - Whether user has active vote locks
- `lockAmount` - Amount locked in microSTX
- `unlockHeight` - Block height when locks expire
- `canMigrateNow` - Whether user can migrate immediately
- `isLoading` - Loading state
- `error` - Error message if any

## Migration Process

### High-Level Flow

1. **Planning** (2-4 weeks)
   - Deploy to testnet
   - Run tests
   - Security audit
   - Create migration scripts
   - Update documentation

2. **Deployment** (Day 0)
   - Deploy new contract to mainnet
   - Update configuration
   - Deploy frontend
   - Announce migration

3. **Active Migration** (30 days)
   - Monitor migration progress
   - Provide user support
   - Generate reports
   - Send reminders

4. **Deprecation** (30 days)
   - Deprecate old contract UI
   - Continue limited support
   - Proactive outreach

5. **Support End** (Day 60)
   - End active support
   - Archive migration data
   - Post-mortem review

### User Migration Flow

1. **Detection** - Frontend detects legacy assets
2. **Notification** - Display migration banner
3. **Pre-Check** - Verify migration eligibility
4. **Execution** - Withdraw and re-stake
5. **Confirmation** - Verify success

### State Preservation

#### Preserved
- Staked STX (amount)
- Voting power (recalculated)
- Reputation (via claim mechanism)

#### Not Preserved
- Proposal history (remains in old contract)
- Vote records (remains in old contract)
- Transaction history (permanent on blockchain)

## Migration Checklist

### Pre-Migration

- [ ] New contract deployed to testnet
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Migration scripts tested
- [ ] Documentation updated
- [ ] Frontend components ready
- [ ] Communication materials prepared
- [ ] Team trained
- [ ] Monitoring configured
- [ ] Rollback plan documented

### Migration Day

- [ ] Deploy contract to mainnet
- [ ] Verify deployment
- [ ] Update configuration
- [ ] Deploy frontend
- [ ] Verify frontend
- [ ] Announce migration
- [ ] Monitor migrations
- [ ] Provide support

### Post-Migration

- [ ] Track adoption rate
- [ ] Generate reports
- [ ] Address issues
- [ ] Send reminders
- [ ] Deprecate old UI
- [ ] End support period
- [ ] Conduct post-mortem

## Monitoring

### Key Metrics

- **Adoption Rate**: Percentage of users who have migrated
- **Success Rate**: Percentage of migration attempts that succeed
- **Support Burden**: Number of support tickets per migration
- **User Satisfaction**: Feedback from migrated users

### Alerts

- Migration success rate < 90%
- Support requests > 10% of migrations
- Critical errors in migration flow
- Network congestion affecting migrations

## Rollback Procedures

### When to Rollback

- Critical bug in new contract
- Migration success rate < 50% after 24 hours
- Significant user funds at risk
- Widespread user complaints

### How to Rollback

1. Revert frontend to old contract
2. Announce rollback immediately
3. Investigate root cause
4. Deploy fix
5. Retry migration

## Support

### For Users

- GitHub Issues: [link]
- Discord: [link]
- Email: support@sprintfund.xyz

### For Operators

- Internal documentation: [link]
- On-call rotation: [link]
- Escalation procedures: [link]

## Testing

### Unit Tests

```bash
# Test migration scripts
cd scripts
npm test

# Test frontend components
cd frontend
npm test
```

### Integration Tests

```bash
# Test complete migration flow on testnet
./test-migration-flow.sh
```

### Manual Testing

1. Deploy to testnet
2. Stake in old contract
3. Check legacy balance
4. Migrate using UI
5. Verify migration success
6. Test error scenarios

## Best Practices

### Communication

- Announce early and often
- Provide clear timelines
- Update FAQ based on questions
- Post regular status updates
- Be transparent about issues

### Technical

- Test thoroughly on testnet
- Monitor closely during migration
- Respond quickly to issues
- Keep rollback plan ready
- Document everything

### Support

- Staff adequately for migration period
- Respond quickly to user questions
- Update documentation based on feedback
- Proactively reach out to high-value users
- Maintain support coverage 24/7 during critical period

## Lessons Learned

After each migration, document:

1. **What Went Well**
   - Successful strategies
   - Effective communication
   - Technical wins

2. **What Went Wrong**
   - Unexpected issues
   - User pain points
   - Technical failures

3. **What to Improve**
   - Process improvements
   - Technical enhancements
   - Communication strategies

4. **Action Items**
   - Specific improvements for next migration
   - Documentation updates
   - Tool development

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-29 | Initial migration system documentation |

## Contributing

To improve the migration system:

1. Test migration tools on testnet
2. Provide feedback on documentation
3. Suggest improvements to UI/UX
4. Report bugs or issues
5. Submit pull requests

## License

Same as main project license.

---

**Last Updated**: 2026-04-29  
**Maintained By**: SprintFund Core Team
