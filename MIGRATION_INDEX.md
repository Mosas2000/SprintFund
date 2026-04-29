# Migration Documentation Index

## Quick Navigation

### 🚀 Getting Started
- **[Quick Start Guide](./MIGRATION_QUICKSTART.md)** - Migrate in 5 minutes
- **[User Migration Guide](./USER_MIGRATION_GUIDE.md)** - Detailed user instructions
- **[Migration FAQ](./MIGRATION_FAQ.md)** - Common questions and answers

### 📚 Complete Documentation
- **[Migration System README](./MIGRATION_README.md)** - System overview and tools
- **[Contract Migration Guide](./CONTRACT_MIGRATION_GUIDE.md)** - Technical guide
- **[Operator Runbook](./OPERATOR_MIGRATION_RUNBOOK.md)** - Day-of-migration procedures

### 📋 Planning & Execution
- **[Migration Checklist](./MIGRATION_CHECKLIST.md)** - Complete task checklist
- **[Timeline Template](./MIGRATION_TIMELINE_TEMPLATE.md)** - Planning template
- **[Announcement Templates](./MIGRATION_ANNOUNCEMENT_TEMPLATE.md)** - Communication templates

### 📊 Monitoring & Metrics
- **[Migration Metrics](./MIGRATION_METRICS.md)** - Tracking template
- **[State Risks](./MIGRATION_STATE_RISKS.md)** - Risk assessment
- **[Migration Summary](./MIGRATION_SUMMARY.md)** - Implementation summary

### 🔧 Tools & Scripts
- **[check-legacy-balance.js](./scripts/check-legacy-balance.js)** - Check user balances
- **[migrate-stake.js](./scripts/migrate-stake.js)** - Automated migration
- **[migration-report.js](./scripts/migration-report.js)** - Progress reporting

### 🎨 Frontend Components
- **[useLegacyBalance](./frontend/src/hooks/useLegacyBalance.ts)** - Balance detection hook
- **[MigrationBanner](./frontend/src/components/MigrationBanner.tsx)** - Notification banner
- **[MigrationModal](./frontend/src/components/MigrationModal.tsx)** - Migration wizard
- **[MigrationStatus](./frontend/src/components/MigrationStatus.tsx)** - Status display

---

## Documentation by Role

### For End Users
1. Start with [Quick Start Guide](./MIGRATION_QUICKSTART.md)
2. Read [User Migration Guide](./USER_MIGRATION_GUIDE.md) for details
3. Check [Migration FAQ](./MIGRATION_FAQ.md) for questions

### For Operators
1. Read [Contract Migration Guide](./CONTRACT_MIGRATION_GUIDE.md)
2. Follow [Operator Runbook](./OPERATOR_MIGRATION_RUNBOOK.md)
3. Use [Migration Checklist](./MIGRATION_CHECKLIST.md)
4. Track with [Migration Metrics](./MIGRATION_METRICS.md)

### For Developers
1. Review [Migration System README](./MIGRATION_README.md)
2. Study [State Risks](./MIGRATION_STATE_RISKS.md)
3. Examine frontend components and hooks
4. Test with migration scripts

### For Project Managers
1. Use [Timeline Template](./MIGRATION_TIMELINE_TEMPLATE.md)
2. Review [Migration Checklist](./MIGRATION_CHECKLIST.md)
3. Prepare [Announcement Templates](./MIGRATION_ANNOUNCEMENT_TEMPLATE.md)
4. Monitor [Migration Metrics](./MIGRATION_METRICS.md)

---

## Documentation by Phase

### Planning Phase
- [Contract Migration Guide](./CONTRACT_MIGRATION_GUIDE.md) - Overview
- [Timeline Template](./MIGRATION_TIMELINE_TEMPLATE.md) - Schedule
- [State Risks](./MIGRATION_STATE_RISKS.md) - Risk assessment
- [Migration Checklist](./MIGRATION_CHECKLIST.md) - Tasks

### Development Phase
- [Migration System README](./MIGRATION_README.md) - Tools overview
- Scripts documentation (check-legacy, migrate, report)
- Frontend components documentation
- Test suite

### Communication Phase
- [Announcement Templates](./MIGRATION_ANNOUNCEMENT_TEMPLATE.md) - Messages
- [User Migration Guide](./USER_MIGRATION_GUIDE.md) - User docs
- [Migration FAQ](./MIGRATION_FAQ.md) - Support docs
- [Quick Start Guide](./MIGRATION_QUICKSTART.md) - Quick reference

### Execution Phase
- [Operator Runbook](./OPERATOR_MIGRATION_RUNBOOK.md) - Procedures
- [Migration Checklist](./MIGRATION_CHECKLIST.md) - Task tracking
- [Migration Metrics](./MIGRATION_METRICS.md) - Monitoring

### Post-Migration Phase
- [Migration Summary](./MIGRATION_SUMMARY.md) - Results
- [Migration Metrics](./MIGRATION_METRICS.md) - Final stats
- Lessons learned documentation

---

## Quick Reference

### Commands

```bash
# Check legacy balance
npm run check-legacy -- --address <address>

# Migrate stake
npm run migrate -- --amount <microSTX>

# Generate report
npm run migration-report -- --addresses users.txt

# Validate config
npm run validate-config
```

### Key Files

- **Config**: `contract-config.json`
- **Scripts**: `scripts/check-legacy-balance.js`, `scripts/migrate-stake.js`
- **Components**: `frontend/src/components/Migration*.tsx`
- **Hooks**: `frontend/src/hooks/useLegacyBalance.ts`

### Important Links

- [Contract Versions](./CONTRACT_VERSIONS.md)
- [Configuration Guide](./CONFIGURATION.md)
- [Main README](./README.md)

---

## Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| Quick Start Guide | ✅ Complete | 2026-04-29 |
| User Migration Guide | ✅ Complete | 2026-04-29 |
| Contract Migration Guide | ✅ Complete | 2026-04-29 |
| Operator Runbook | ✅ Complete | 2026-04-29 |
| Migration FAQ | ✅ Complete | 2026-04-29 |
| Timeline Template | ✅ Complete | 2026-04-29 |
| Announcement Templates | ✅ Complete | 2026-04-29 |
| Migration Metrics | ✅ Complete | 2026-04-29 |
| State Risks | ✅ Complete | 2026-04-29 |
| Migration Checklist | ✅ Complete | 2026-04-29 |
| Migration README | ✅ Complete | 2026-04-29 |
| Migration Summary | ✅ Complete | 2026-04-29 |

---

## Contributing

To improve migration documentation:

1. Identify gaps or unclear sections
2. Test procedures on testnet
3. Provide feedback via GitHub issues
4. Submit pull requests with improvements

---

**Index Version**: 1.0  
**Last Updated**: 2026-04-29  
**Maintained By**: SprintFund Core Team
