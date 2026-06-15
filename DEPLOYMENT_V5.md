# SprintFund v5-micro Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Contract Readiness
- [x] v5-micro contract completed
- [x] All security features implemented
- [x] 33/36 tests passing (91.7%)
- [x] Admin functions tested
- [x] Configurable minimum stake working

### ✅ Frontend Integration
- [x] Config updated to v5-micro
- [x] Admin panel component created
- [x] Dynamic minimum stake display
- [x] Contract info utilities
- [x] Environment variables updated

### 🔄 Testing (Before Mainnet)
- [ ] Local devnet testing
- [ ] Testnet deployment
- [ ] Integration testing
- [ ] Admin function verification
- [ ] User acceptance testing

---

## 🚀 Deployment Steps

### Option A: Deploy to Testnet First (RECOMMENDED)

#### 1. Prepare Testnet Deployment

```bash
# 1. Update network in Clarinet.toml or use deployment plan
cd /path/to/sprintfund

# 2. Create testnet deployment plan
cat > deployments/v5-micro.testnet-plan.yaml << 'EOF'
---
id: 0
name: SprintFund v5-micro Testnet
network: testnet
stacks-node: https://api.testnet.hiro.so
bitcoin-node: http://blockstream.info/testnet/api
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: sprintfund-core-v5-micro
            expected-sender: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 300000
            path: contracts/sprintfund-core-v5-micro.clar
            anchor-block-only: true
EOF

# 3. Deploy to testnet
clarinet deployments apply -p deployments/v5-micro.testnet-plan.yaml
```

#### 2. Test on Testnet

```bash
# Run contract tests against testnet
npm test

# Update frontend to use testnet
export NEXT_PUBLIC_NETWORK=testnet
export NEXT_PUBLIC_CONTRACT_ADDRESS=<TESTNET_ADDRESS>
export NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v5-micro

# Start frontend
cd frontend
npm run dev
```

**Manual Testing Checklist:**
- [ ] Stake minimum amount (100 microSTX)
- [ ] Create proposal
- [ ] Vote on proposal
- [ ] Execute proposal (after voting period)
- [ ] Withdraw stake
- [ ] Reclaim vote cost
- [ ] Admin: Update minimum stake
- [ ] Admin: Verify new minimum works
- [ ] Verify all events emit correctly

#### 3. Gather Feedback
- [ ] Test with 3-5 users
- [ ] Document any issues
- [ ] Fix critical bugs
- [ ] Re-test on testnet

---

### Option B: Deploy Directly to Mainnet

⚠️ **Only use this if you're confident in the contract and have tested locally**

#### 1. Prepare Mainnet Deployment

```bash
# Update Mainnet.toml with your deployer mnemonic
cp settings/Mainnet.toml settings/Mainnet.toml.local
# Edit Mainnet.toml.local with your actual mnemonic (NEVER commit this!)

# Create mainnet deployment plan
cat > deployments/v5-micro.mainnet-plan.yaml << 'EOF'
---
id: 0
name: SprintFund v5-micro Mainnet
network: mainnet
stacks-node: https://api.hiro.so
bitcoin-node: http://blockstream.info/api
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: sprintfund-core-v5-micro
            expected-sender: SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60
            cost: 800000
            path: contracts/sprintfund-core-v5-micro.clar
            anchor-block-only: true
EOF
```

#### 2. Deploy to Mainnet

```bash
# Verify contract syntax
clarinet check

# Estimate deployment cost
clarinet deployments generate --low-cost deployments/v5-micro.mainnet-plan.yaml

# Deploy (requires STX in deployer wallet)
clarinet deployments apply -p deployments/v5-micro.mainnet-plan.yaml

# Save the contract address!
# Expected format: SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro
```

#### 3. Update Frontend

```bash
# Update production environment
cat > frontend/.env.production << 'EOF'
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_MAINNET_ADDRESS>
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v5-micro
NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so
EOF

# Build and deploy frontend
cd frontend
npm run build
# Deploy to Vercel/Netlify/your hosting
```

---

## 🔍 Post-Deployment Verification

### Immediate Checks (First Hour)

```bash
# 1. Verify contract is deployed
curl "https://api.hiro.so/v2/contracts/interface/<ADDRESS>/sprintfund-core-v5-micro"

# 2. Test read-only functions
clarinet console
>>> (contract-call? .sprintfund-core-v5-micro get-version)
>>> (contract-call? .sprintfund-core-v5-micro get-min-stake-amount)
>>> (contract-call? .sprintfund-core-v5-micro get-contract-owner)
```

### Manual Testing (First Day)

- [ ] Connect wallet to frontend
- [ ] Verify contract address displayed correctly
- [ ] Check minimum stake displayed
- [ ] Stake minimum amount
- [ ] Create test proposal
- [ ] Vote on proposal
- [ ] Monitor for 24 hours

### Owner Actions (First Week)

- [ ] Test admin panel access
- [ ] Consider adjusting minimum stake if needed
- [ ] Monitor proposal activity
- [ ] Check for any errors in explorer
- [ ] Announce to community

---

## 🎯 Migration from v4-minimal (Optional)

If users have funds in v4-minimal and you want to migrate:

### Option 1: Parallel Operation
- Keep v4-minimal active
- Deploy v5-micro separately
- Let users choose which to use
- Gradually sunset v4-minimal

### Option 2: Snapshot & Migrate
```bash
# 1. Take snapshot of v4-minimal state
# 2. Pause new v4 proposals
# 3. Users withdraw from v4
# 4. Deploy v5-micro
# 5. Users stake in v5
```

### Option 3: Fresh Start
- Deploy v5-micro as new DAO
- Announce to community
- Users migrate voluntarily
- v4-minimal remains for historical reference

---

## 📊 Monitoring & Maintenance

### Daily Monitoring
- Check contract events via API
- Monitor proposal activity
- Watch for unusual transactions
- Review error logs

### Weekly Tasks
- Review minimum stake appropriateness
- Check if adjustments needed
- Monitor total staked amount
- Review voting patterns

### Monthly Tasks
- Security review
- Performance optimization
- Community feedback gathering
- Documentation updates

---

## 🚨 Emergency Procedures

### If Contract Has Issues

1. **Identify the problem**
   - Check transaction history
   - Review error messages
   - Consult test results

2. **Immediate actions**
   - Announce issue to users
   - Document the problem
   - Assess severity

3. **Resolution paths**
   - Minor: Can fix via ownership transfer or admin functions
   - Major: May need new contract deployment
   - Critical: Pause operations, deploy fix

### Admin Access Lost

If you lose access to owner account:
- Ownership cannot be recovered without transfer
- Deploy new contract if necessary
- This is why transfer-ownership function exists

---

## 📞 Support Resources

### Documentation
- [REFACTORING_PROGRESS.md](REFACTORING_PROGRESS.md) - Full refactoring details
- [README.md](README.md) - User guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture

### Testing
- Run tests: `npm test`
- Check specific: `npm test -- tests/sprintfund-core-v5-micro.test.ts`

### Community
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Discord: Real-time support (if available)

---

## ✅ Success Criteria

### Technical
- [x] Contract deployed successfully
- [ ] All read functions working
- [ ] All write functions working
- [ ] Admin functions accessible
- [ ] Events emitting correctly
- [ ] No critical errors

### User Experience
- [ ] Wallet connection smooth
- [ ] Transactions completing
- [ ] UI responsive
- [ ] Data displaying correctly
- [ ] Mobile compatible

### Business
- [ ] Users staking successfully
- [ ] Proposals being created
- [ ] Voting happening
- [ ] Proposals being executed
- [ ] Community engaged

---

## 🎉 Launch Announcement Template

```markdown
🚀 SprintFund v5-micro is LIVE!

We're excited to announce the deployment of SprintFund v5-micro with major improvements:

✨ **What's New**
- Configurable micro-stakes (start with 0.0001 STX!)
- Admin controls for dynamic governance
- All security features from v4 + more
- Enhanced admin panel for contract owner

📍 **Contract Address**
[Your deployed address here]

🔗 **Links**
- dApp: [Your frontend URL]
- Explorer: [Stacks explorer link]
- Docs: [GitHub repo]

💡 **Getting Started**
1. Connect your Hiro/Leather wallet
2. Stake as little as 0.0001 STX
3. Create or vote on proposals
4. Be part of the governance!

Questions? Check our docs or join the discussion!
```

---

**Ready to Deploy? Start with Testnet! 🚀**
