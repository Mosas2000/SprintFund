# Operator Migration Runbook

## Purpose

This runbook provides step-by-step instructions for operators performing a contract version migration. Follow these procedures to ensure a smooth transition with minimal user disruption.

## Pre-Migration Phase (2-4 weeks before)

### Week -4: Planning and Preparation

#### 1. Deploy to Testnet

```bash
# Deploy new contract to testnet
clarinet deploy --testnet

# Verify deployment
node scripts/check-legacy-balance.js --network testnet --address <test-address>
```

#### 2. Run Test Suite

```bash
# Run all contract tests
clarinet test

# Run frontend tests
cd frontend
npm test

# Run integration tests
npm run test:integration
```

#### 3. Security Audit

- [ ] Review contract changes for security vulnerabilities
- [ ] Run static analysis tools
- [ ] Conduct manual code review
- [ ] Document all changes in CHANGELOG.md
- [ ] Get external audit if changes are significant

#### 4. Create Migration Scripts

```bash
# Test migration scripts on testnet
node scripts/check-legacy-balance.js --network testnet --address <address>
node scripts/migrate-stake.js --network testnet --amount 10000000 --dry-run
node scripts/migration-report.js --network testnet --addresses testnet-addresses.txt
```

#### 5. Update Documentation

- [ ] Update CONTRACT_VERSIONS.md with new version details
- [ ] Review and update CONTRACT_MIGRATION_GUIDE.md
- [ ] Review and update USER_MIGRATION_GUIDE.md
- [ ] Update MIGRATION_STATE_RISKS.md with any new risks
- [ ] Create version-specific migration notes

### Week -2: Testing and Communication

#### 6. End-to-End Testing

```bash
# Test complete migration flow on testnet
# 1. Stake in old contract
node scripts/stake.js --network testnet --amount 100000000

# 2. Check balance
node scripts/check-legacy-balance.js --network testnet --address <address>

# 3. Migrate
node scripts/migrate-stake.js --network testnet --amount 100000000

# 4. Verify migration
# Check new contract balance
```

#### 7. Frontend Testing

- [ ] Test migration banner displays correctly
- [ ] Test migration modal workflow
- [ ] Test migration status component
- [ ] Test version mismatch warning
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

#### 8. Prepare Communication Materials

- [ ] Draft announcement blog post
- [ ] Prepare Discord/Telegram messages
- [ ] Create Twitter thread
- [ ] Prepare email template
- [ ] Create FAQ document
- [ ] Record video tutorial (optional)

### Week -1: Final Preparations

#### 9. Set Migration Timeline

```
Example Timeline:
- Day 0 (Monday): Deploy new contract, announce migration
- Day 1-7: Early migration period, high support availability
- Day 14: Reminder announcement
- Day 30: Old contract UI deprecated
- Day 60: End of migration support period
```

#### 10. Prepare Monitoring

- [ ] Set up contract monitoring dashboard
- [ ] Configure alerts for failed transactions
- [ ] Prepare migration metrics tracking
- [ ] Set up support ticket system
- [ ] Assign support team members

#### 11. Final Checklist

- [ ] New contract deployed and verified on testnet
- [ ] All tests passing
- [ ] Documentation complete and reviewed
- [ ] Migration scripts tested
- [ ] Frontend changes ready to deploy
- [ ] Communication materials prepared
- [ ] Support team briefed
- [ ] Rollback plan documented
- [ ] Monitoring configured
- [ ] Timeline communicated to team

## Migration Day (Day 0)

### Morning: Deployment

#### 1. Deploy New Contract (8:00 AM)

```bash
# Verify you're on the right network
echo $NETWORK

# Deploy to mainnet
clarinet deploy --mainnet

# Record contract address and transaction ID
CONTRACT_ADDRESS=<address>
DEPLOY_TX=<txid>

# Verify deployment
stx get-contract-info $CONTRACT_ADDRESS.sprintfund-core-v4
```

#### 2. Verify Deployment (8:30 AM)

```bash
# Test read-only functions
node scripts/check-legacy-balance.js --network mainnet --address <test-address>

# Verify contract version
# Should return new version number
```

#### 3. Update Configuration (9:00 AM)

```bash
# Update contract-config.json
vim contract-config.json
# Change version and contract name

# Validate configuration
cd scripts
npm run validate-config

# Commit changes
git add contract-config.json
git commit -m "Update to contract version X"
git push origin main
```

#### 4. Deploy Frontend (9:30 AM)

```bash
# Build frontend with new config
cd frontend
npm run build

# Deploy to production
npm run deploy

# Verify deployment
curl https://app.sprintfund.xyz/api/health
```

#### 5. Verify Frontend (10:00 AM)

- [ ] Visit app.sprintfund.xyz
- [ ] Connect wallet
- [ ] Verify contract address in UI
- [ ] Check migration banner appears (if you have legacy assets)
- [ ] Test migration flow end-to-end
- [ ] Verify all pages load correctly

### Afternoon: Announcement and Monitoring

#### 6. Announce Migration (10:30 AM)

```bash
# Post to all channels simultaneously
# - GitHub Release
# - Discord announcement
# - Telegram announcement
# - Twitter thread
# - Email to users (if applicable)
```

**Announcement Template:**

```
🚀 SprintFund Contract Migration - v3 → v4

We've deployed an improved version of the SprintFund contract with:
- [List key improvements]
- [List bug fixes]
- [List new features]

📋 What you need to do:
1. Visit app.sprintfund.xyz
2. Click "Migrate Now" when prompted
3. Approve the migration transactions
4. Your stake and reputation will be preserved

⏰ Timeline:
- Migration available: Today
- Old contract UI disabled: [Date + 30 days]
- Support ends: [Date + 60 days]

📚 Resources:
- Migration Guide: [link]
- FAQ: [link]
- Support: [link]

Questions? We're here to help!
```

#### 7. Monitor Initial Migrations (11:00 AM - 5:00 PM)

```bash
# Generate migration report every hour
node scripts/migration-report.js \
  --addresses known-users.txt \
  --output migration-report-$(date +%Y%m%d-%H%M).json

# Check for errors
tail -f /var/log/sprintfund/errors.log

# Monitor transaction success rate
# Alert if success rate < 90%
```

**Monitoring Checklist:**

- [ ] Track number of migrations per hour
- [ ] Monitor transaction success rate
- [ ] Check for error patterns
- [ ] Respond to support requests within 1 hour
- [ ] Update FAQ based on common questions
- [ ] Post status updates every 4 hours

#### 8. End of Day Summary (5:00 PM)

```bash
# Generate final report for day 0
node scripts/migration-report.js \
  --addresses known-users.txt \
  --output migration-report-day0.json \
  --format csv

# Post summary to team channel
```

**Summary Template:**

```
Day 0 Migration Summary:

✅ Migrations completed: X
⏳ Pending migrations: Y
❌ Failed migrations: Z
📊 Success rate: XX%

Top issues:
1. [Issue description] - [Resolution]
2. [Issue description] - [Resolution]

Action items for tomorrow:
- [Action item]
- [Action item]
```

## Post-Migration Phase (Days 1-60)

### Week 1: Active Support

#### Daily Tasks

```bash
# Morning: Generate overnight report
node scripts/migration-report.js \
  --addresses known-users.txt \
  --output migration-report-$(date +%Y%m%d).json

# Review support tickets
# Respond to all tickets within 4 hours

# Evening: Post daily update
```

**Metrics to Track:**

- Total migrations completed
- Migration success rate
- Average migration time
- Support ticket volume
- Common issues and resolutions

#### Day 7: Week 1 Review

- [ ] Review migration progress (target: 40% complete)
- [ ] Identify users needing assistance
- [ ] Send reminder announcement
- [ ] Update FAQ with new questions
- [ ] Adjust support strategy if needed

### Week 2: Continued Monitoring

#### Day 14: Reminder Announcement

```
📢 Migration Reminder

50% of users have successfully migrated to the new contract!

If you haven't migrated yet:
- Visit app.sprintfund.xyz
- Click "Migrate Now"
- Takes less than 5 minutes

Old contract UI will be disabled in 16 days.

Need help? Contact us: [support channels]
```

#### Metrics Review

- [ ] Migration rate should be >60%
- [ ] Support ticket volume should be decreasing
- [ ] No critical issues outstanding

### Week 4: Deprecation Preparation

#### Day 28: Final Warning

```
⚠️ Final Migration Reminder

The old contract UI will be disabled in 2 days.

Last chance to migrate easily through the UI!

After Day 30, you can still withdraw from the old contract,
but the migration wizard will no longer be available.

Migrate now: app.sprintfund.xyz
```

#### Day 30: Deprecate Old Contract UI

```bash
# Update frontend to hide old contract by default
# Old contract still accessible via direct link

# Deploy frontend update
cd frontend
npm run build
npm run deploy

# Announce deprecation
```

### Week 8: Migration Support End

#### Day 60: End of Support Period

```
📋 Migration Support Period Ending

Active migration support ends today.

✅ XX% of users have migrated
⚠️ YY users still have assets in old contract

You can always:
- Withdraw from old contract (no time limit)
- Contact support for special assistance
- View old contract data on blockchain explorer

Thank you for migrating!
```

## Rollback Procedures

### When to Rollback

Rollback if:
- Critical bug discovered in new contract
- Migration success rate < 50% after 24 hours
- Significant user funds at risk
- Widespread user complaints about issues

### Rollback Steps

#### 1. Immediate Response (Within 1 hour)

```bash
# Revert frontend to old contract
git revert <migration-commit>
git push origin main

# Deploy reverted frontend
cd frontend
npm run build
npm run deploy

# Verify rollback
curl https://app.sprintfund.xyz/api/health
```

#### 2. Communication (Within 2 hours)

```
🚨 Migration Temporarily Paused

We've identified an issue with the new contract and have
temporarily reverted to the previous version.

Your funds are safe. No action is required.

We're investigating the issue and will provide updates
every 4 hours.

Status page: [link]
```

#### 3. Investigation

- [ ] Identify root cause
- [ ] Assess impact on users who already migrated
- [ ] Determine if fix is possible
- [ ] Estimate time to resolution
- [ ] Communicate findings to team

#### 4. Resolution

```bash
# Deploy fixed contract
clarinet deploy --mainnet

# Test thoroughly
# Update configuration
# Redeploy frontend

# Announce retry
```

### Partial Rollback

If only frontend needs rollback:

```bash
# Revert frontend only
git revert <frontend-commit>
cd frontend
npm run deploy

# Keep new contract deployed
# Users can still interact via scripts
```

## Emergency Procedures

### Critical Bug in New Contract

1. **Immediate**: Pause contract if possible
2. **Communicate**: Alert all users immediately
3. **Assess**: Determine severity and impact
4. **Respond**: Deploy fix or rollback
5. **Monitor**: Track for exploitation attempts

### Network Congestion

1. **Increase**: Recommended transaction fees
2. **Communicate**: Warn users about delays
3. **Extend**: Migration timeline if needed
4. **Monitor**: Network status continuously

### Support Overwhelm

1. **Triage**: Prioritize critical issues
2. **Automate**: Create canned responses for common issues
3. **Escalate**: Bring in additional support staff
4. **Document**: Update FAQ in real-time

## Success Criteria

### Day 1
- [ ] New contract deployed successfully
- [ ] Frontend updated and functional
- [ ] At least 10 successful migrations
- [ ] No critical bugs reported
- [ ] Support response time < 2 hours

### Week 1
- [ ] 40%+ of users migrated
- [ ] Migration success rate > 95%
- [ ] All critical issues resolved
- [ ] Support response time < 4 hours

### Week 2
- [ ] 60%+ of users migrated
- [ ] No outstanding critical issues
- [ ] Support ticket volume decreasing

### Week 4
- [ ] 80%+ of users migrated
- [ ] Old contract UI deprecated
- [ ] Migration process documented

### Week 8
- [ ] 90%+ of users migrated
- [ ] Support period ended
- [ ] Lessons learned documented

## Post-Mortem

After migration is complete, conduct a post-mortem:

### What Went Well
- List successful strategies
- Effective communication methods
- Technical wins

### What Went Wrong
- Unexpected issues
- User pain points
- Technical failures

### What to Improve
- Process improvements
- Technical enhancements
- Communication strategies

### Action Items
- Specific improvements for next migration
- Documentation updates
- Tool development

### Metrics Summary
- Total migrations: X
- Success rate: XX%
- Average migration time: X minutes
- Support tickets: X
- User satisfaction: XX%

## Appendix

### Useful Commands

```bash
# Check contract status
stx get-contract-info $CONTRACT_ADDRESS.$CONTRACT_NAME

# Monitor transactions
stx get-transactions $CONTRACT_ADDRESS

# Generate migration report
node scripts/migration-report.js --addresses users.txt

# Check user balance
node scripts/check-legacy-balance.js --address $USER_ADDRESS

# Test migration
node scripts/migrate-stake.js --amount 10000000 --dry-run
```

### Contact Information

- **On-call Engineer**: [contact]
- **Support Lead**: [contact]
- **Product Manager**: [contact]
- **Security Team**: [contact]

### External Resources

- Stacks Explorer: https://explorer.hiro.so
- Stacks Status: https://status.stacks.co
- Hiro API Status: https://status.hiro.so

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-29  
**Next Review**: Before next migration
