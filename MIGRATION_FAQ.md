# Migration FAQ

## General Questions

### What is a contract migration?

A contract migration is the process of moving from one version of the SprintFund smart contract to another. Since smart contracts on Stacks are immutable, we deploy new versions when we need to make improvements or fix issues.

### Why do I need to migrate?

To continue participating in SprintFund governance with the latest features, security improvements, and bug fixes, you need to migrate your staked STX to the new contract version.

### Is migration mandatory?

While not technically mandatory, it is strongly recommended. After the migration period, the old contract UI will be deprecated, making it harder to participate in governance. However, you can always withdraw your STX from the old contract.

### How long do I have to migrate?

You typically have 30 days to migrate using the easy migration wizard. After that, the old contract UI is deprecated, but you can still withdraw your STX manually at any time.

## Safety and Security

### Is my STX safe during migration?

Yes. Migration uses the same secure smart contract calls as normal staking. Your private keys never leave your wallet, and you approve each transaction.

### What if something goes wrong during migration?

The migration process is designed to be safe. If a transaction fails, your STX remains in its current location (either old contract or your wallet). You can retry the migration at any time.

### Can I lose my STX during migration?

No. Your STX is always under your control. Migration simply moves it from one contract to another through standard withdrawal and staking transactions.

### Has the migration process been audited?

Yes. The migration process and new contract have been thoroughly tested and reviewed. See our security documentation for details.

## Migration Process

### How long does migration take?

The migration process takes 2-3 minutes to initiate. Blockchain confirmation typically takes 10-30 minutes. You can close the window during confirmation.

### How much does migration cost?

Migration requires transaction fees of approximately 0.025-0.030 STX total. This covers the withdrawal from the old contract and staking in the new contract.

### Can I migrate in parts?

Yes. You can migrate any amount of your stake. The rest remains in the old contract until you migrate it.

### What if I have multiple wallets?

Each wallet must be migrated separately. Assets in different wallets are independent.

### Can I undo a migration?

No. Once migrated, you cannot move back to the old contract. However, you can always withdraw your STX from the new contract if needed.

## Vote Locks and Timing

### What if I have active votes?

If you have active vote locks, you must wait for them to expire before migrating. The migration UI will show your estimated unlock time.

### How do I know when my votes unlock?

The migration banner and status component show your unlock block height. You can also check your vote locks in the dashboard.

### Can I vote while waiting to migrate?

Yes, you can continue voting in the old contract while waiting for your locks to expire. However, new proposals will be in the new contract.

### What happens to my pending proposals?

Proposals in the old contract will complete normally. New proposals must be created in the new contract after migration.

## Assets and State

### What happens to my staked STX?

Your staked STX is withdrawn from the old contract and re-staked in the new contract. The amount remains the same (minus transaction fees).

### What happens to my voting power?

Your voting power is recalculated based on your stake in the new contract using the same formula.

### What happens to my reputation?

Your reputation is preserved through the migration process. You may need to claim it in the new contract.

### What happens to my proposal history?

All historical proposals remain in the old contract and are viewable on the blockchain. The new contract starts with a fresh proposal list.

### What happens to my vote history?

Your vote history remains permanently recorded in the old contract on the blockchain. It cannot be moved but is always accessible.

## Technical Issues

### The migration button is disabled. Why?

The migration button is disabled if:
- You have active vote locks
- You have no assets in the old contract
- There's a connection issue with your wallet

### I get an error when trying to migrate. What should I do?

Common solutions:
1. Ensure your wallet is connected
2. Check you have enough STX for transaction fees
3. Wait a few minutes and try again
4. Clear your browser cache
5. Contact support if the issue persists

### The transaction is taking a long time. Is this normal?

Yes. Blockchain transactions can take 10-30 minutes to confirm, sometimes longer during network congestion. You can track your transaction in the Stacks Explorer.

### I closed the window during migration. What happens?

The migration continues on the blockchain. You can check the status by reconnecting your wallet and viewing the migration status component.

### My migration failed. What now?

If a migration transaction fails, your STX remains in its current location. Check the error message, resolve any issues (like insufficient balance), and try again.

## After Migration

### How do I verify my migration succeeded?

After migration, check your dashboard. Your stake should appear in the new contract, and the migration banner should disappear.

### Can I still access the old contract?

Yes. The old contract remains on the blockchain forever. After the UI deprecation period, you can still access it via direct contract calls or blockchain explorers.

### What if I forgot to migrate?

You can always withdraw your STX from the old contract, even after the migration period ends. However, the easy migration wizard may no longer be available.

### Can I participate in governance immediately after migrating?

Yes. Once your migration transactions confirm, you can immediately participate in governance using the new contract.

## Support and Help

### Where can I get help with migration?

- GitHub Issues: [link]
- Discord: [link]
- Email: support@sprintfund.xyz
- Migration Guide: [link]

### What information should I provide when asking for help?

Please provide:
- Your wallet address
- Transaction IDs (if any)
- Screenshot of error message
- Description of what you tried

### How quickly will I get a response?

- Discord: Usually within 1 hour
- GitHub: Within 24 hours
- Email: Within 48 hours

### Can someone migrate for me?

No. Migration requires your wallet's private key to sign transactions. Never share your private key with anyone.

## Advanced Users

### Can I migrate using scripts instead of the UI?

Yes. We provide command-line scripts for advanced users:

```bash
# Check your legacy balance
node scripts/check-legacy-balance.js --address <your-address>

# Migrate your stake
node scripts/migrate-stake.js --amount <microSTX>
```

### Can I interact with both contracts simultaneously?

Technically yes, but not recommended. You should migrate all assets to the new contract to avoid confusion.

### How do I query the old contract directly?

You can use the Stacks API or blockchain explorers to query old contract state:

```bash
# Using Stacks CLI
stx call-read-only <contract-address> <contract-name> <function-name>
```

### Can I build tools that work with both contract versions?

Yes. The frontend components and hooks are designed to detect and work with multiple contract versions.

## Specific Scenarios

### I'm traveling during the migration period. What should I do?

No rush. You have at least 30 days to migrate, and you can always withdraw from the old contract later. Migrate when convenient.

### I have a very large stake. Is there anything special I should know?

Large stakes migrate the same way as small stakes. The transaction fees are the same regardless of amount. Consider migrating during off-peak hours to avoid network congestion.

### I'm a developer integrating with SprintFund. What should I know?

Update your integration to use the new contract address. The API remains largely the same, but check the contract documentation for any changes.

### I'm a validator/node operator. Do I need to do anything?

No special action required. Contract migrations don't affect node operations. Just ensure your node is running the latest Stacks blockchain version.

## Future Migrations

### Will there be more migrations in the future?

Possibly. As the protocol evolves, we may deploy new contract versions. Each migration will follow the same careful process.

### How can I stay informed about future migrations?

Follow our announcement channels:
- GitHub releases
- Discord announcements
- Twitter: @sprintfund
- Email newsletter (if subscribed)

### Will future migrations be easier?

We learn from each migration and continuously improve the process. Future migrations should be even smoother.

### Can I opt out of future migrations?

You can choose not to migrate, but you won't be able to participate in governance with the new contract. You can always withdraw your STX.

## Troubleshooting

### "Insufficient balance for fees"

**Problem**: You don't have enough STX for transaction fees.

**Solution**: Add at least 0.05 STX to your wallet for fees.

### "Transaction failed: (err u1)"

**Problem**: Contract error, possibly due to vote locks.

**Solution**: Check if you have active vote locks. Wait for them to expire.

### "Network error"

**Problem**: Connection issue with Stacks network.

**Solution**: Check your internet connection. Try again in a few minutes.

### "Wallet not connected"

**Problem**: Your wallet disconnected.

**Solution**: Reconnect your wallet and try again.

### "Contract not found"

**Problem**: Configuration issue or network mismatch.

**Solution**: Refresh the page. Ensure you're on the correct network (mainnet/testnet).

## Still Have Questions?

If your question isn't answered here:

1. Check the [Migration Guide](./CONTRACT_MIGRATION_GUIDE.md)
2. Check the [User Guide](./USER_MIGRATION_GUIDE.md)
3. Search existing GitHub issues
4. Ask in Discord
5. Open a new GitHub issue
6. Email support

---

**Last Updated**: 2026-04-29  
**Version**: 1.0
