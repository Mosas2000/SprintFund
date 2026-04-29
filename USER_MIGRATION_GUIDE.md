# User Migration Guide

## Why Do I Need to Migrate?

SprintFund has deployed an improved version of its smart contract. To continue participating in governance and accessing new features, you need to migrate your staked STX to the new contract.

## What Gets Migrated?

### ✅ Preserved

- **Your STX**: All staked funds remain yours
- **Voting Power**: Recalculated based on your stake
- **Reputation**: Preserved through migration process

### ⚠️ Stays in Old Contract

- **Proposal History**: Past proposals remain viewable
- **Vote Records**: Historical votes are preserved
- **Transaction History**: Permanent blockchain record

## Before You Start

### Check Your Eligibility

You can migrate if:
- ✅ You have STX staked in the old contract
- ✅ You have no active vote locks
- ✅ Your wallet is connected

You cannot migrate yet if:
- ❌ You have active votes with unexpired locks
- ❌ You have pending proposals being executed

### What You'll Need

- Connected Stacks wallet (Hiro, Xverse, etc.)
- Small amount of STX for transaction fees (~0.03 STX)
- 2-3 minutes to complete the process

## Migration Steps

### Step 1: Visit SprintFund

Go to [app.sprintfund.xyz](https://app.sprintfund.xyz) and connect your wallet.

### Step 2: Check Migration Status

If you have assets in the old contract, you'll see a banner:

```
⚠️ Contract Migration Available
You have 100 STX staked in the previous contract version.
Migrate now to continue participating in governance.
```

### Step 3: Start Migration

Click **"Migrate Now"** to open the migration wizard.

### Step 4: Review Details

The wizard shows:
- Amount to migrate
- Current voting power
- Estimated gas fees
- What will be preserved

### Step 5: Confirm Migration

Click **"Confirm Migration"** and approve the transactions in your wallet:

1. **Withdraw** from old contract
2. **Stake** in new contract
3. **Claim** reputation (if applicable)

### Step 6: Wait for Confirmation

Transactions typically confirm in 10-30 minutes. You can:
- Close the window (migration continues)
- Track progress in the migration modal
- View transactions in Stacks Explorer

### Step 7: Verify Success

Once complete, you'll see:

```
✓ Migration Complete
- Migrated: 100 STX
- New voting power: 10 votes
- Reputation: Preserved
- Gas cost: 0.015 STX
```

## Troubleshooting

### "You have active vote locks"

**Problem**: You voted on a proposal that hasn't ended yet.

**Solution**: Wait for the proposal to end and your lock to expire. The migration banner will show your estimated unlock time.

### "Insufficient balance for fees"

**Problem**: You don't have enough STX for transaction fees.

**Solution**: Add a small amount of STX to your wallet (0.05 STX recommended).

### "Transaction failed"

**Problem**: The migration transaction was rejected.

**Solution**: 
1. Check your wallet connection
2. Ensure you have sufficient balance
3. Try again in a few minutes
4. Contact support if issue persists

### "Migration taking too long"

**Problem**: Transactions are pending for over an hour.

**Solution**:
1. Check transaction status in Stacks Explorer
2. Network may be congested - wait longer
3. If transaction failed, restart migration
4. Contact support if stuck

## What Happens to Old Contract?

### Immediate (Migration Day)

- Old contract remains functional
- You can still withdraw manually
- Frontend shows migration prompts

### 30 Days After Migration

- Frontend stops showing old contract by default
- Old contract still accessible via direct link
- Withdrawal still possible

### 60 Days After Migration

- Old contract marked as deprecated
- Support for old contract ends
- Withdrawal still possible (always)

## Manual Migration (Advanced)

If you prefer to migrate manually using scripts:

### Check Your Balance

```bash
node scripts/check-legacy-balance.js --address <your-address>
```

### Withdraw from Old Contract

```bash
node scripts/withdraw-legacy.js --amount <microSTX>
```

### Stake in New Contract

```bash
node scripts/stake.js --amount <microSTX>
```

## Cost Breakdown

| Action | Estimated Cost |
|--------|---------------|
| Withdraw from old contract | ~0.015 STX |
| Stake in new contract | ~0.010 STX |
| Claim reputation | ~0.005 STX |
| **Total** | **~0.03 STX** |

Actual costs may vary based on network congestion.

## Timeline

| Date | Event |
|------|-------|
| Migration Available | [To be announced] |
| Migration Recommended By | [+14 days] |
| Old Contract UI Disabled | [+30 days] |
| Support Ends | [+60 days] |

## Frequently Asked Questions

### Will I lose my STX?

No. Migration withdraws your STX from the old contract and re-stakes it in the new one. Your STX never leaves your control.

### Do I have to migrate?

Yes, to continue participating in governance. However, you can always withdraw your STX from the old contract if you prefer not to migrate.

### What if I'm traveling during migration?

No rush. You have at least 30 days to migrate. Your funds are safe in the old contract.

### Can I migrate part of my stake?

Yes. You can migrate any amount. The rest remains in the old contract until you migrate it.

### What happens to my pending proposals?

Proposals in the old contract will complete normally. New proposals must be created in the new contract.

### Will my reputation reset?

No. The migration process preserves your reputation score.

### How long does migration take?

The process takes 2-3 minutes to initiate. Blockchain confirmation takes 10-30 minutes.

### Can I undo migration?

No. Once migrated, you cannot move back to the old contract. However, you can always withdraw your STX from the new contract.

### What if I have multiple wallets?

You need to migrate each wallet separately. Each wallet's assets are independent.

### Is migration secure?

Yes. Migration uses the same secure smart contract calls as normal staking. Your private keys never leave your wallet.

## Need Help?

### Support Channels

- **GitHub Issues**: [github.com/sprintfund/issues](https://github.com/sprintfund/issues)
- **Discord**: [discord.gg/sprintfund](https://discord.gg/sprintfund)
- **Email**: support@sprintfund.xyz

### Before Contacting Support

Please have ready:
- Your wallet address
- Transaction IDs (if any)
- Screenshot of error message
- Description of what you tried

### Response Times

- Discord: Usually within 1 hour
- GitHub: Within 24 hours
- Email: Within 48 hours

## Additional Resources

- [Contract Migration Guide](./CONTRACT_MIGRATION_GUIDE.md) - Technical details
- [Contract Versions](./CONTRACT_VERSIONS.md) - Version history
- [Configuration Guide](./CONFIGURATION.md) - Config management

## Stay Updated

Follow migration progress:
- Twitter: [@sprintfund](https://twitter.com/sprintfund)
- Blog: [blog.sprintfund.xyz](https://blog.sprintfund.xyz)
- GitHub: [github.com/sprintfund](https://github.com/sprintfund)

---

**Last Updated**: [Date]  
**Current Migration**: v1 → v3
