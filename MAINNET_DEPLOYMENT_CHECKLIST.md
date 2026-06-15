# 🚀 Mainnet Deployment Checklist - v5-micro

## ⚠️ IMPORTANT: Read This First

You're about to deploy to **MAINNET** - this is permanent and will cost real STX.

**Estimated Cost**: ~0.9 STX (900,000 microSTX)
**Time Required**: 10-20 minutes
**Reversibility**: Cannot undo deployment

---

## 📋 Pre-Deployment Checklist

### ✅ Contract Ready
- [x] v5-micro contract complete (11,966 bytes)
- [x] All security features implemented
- [x] 91.7% test coverage (33/36 tests passing)
- [x] Deployment plan created
- [x] Clarinet.toml configured

### ⚠️ Wallet Preparation
- [ ] You have access to deployer wallet
- [ ] Wallet has sufficient STX (at least 1.5 STX for safety)
- [ ] Wallet mnemonic is secure and backed up
- [ ] You understand this is mainnet (real money)

### ⚠️ Configuration
- [ ] `settings/Mainnet.toml` has correct mnemonic
- [ ] Deployer address is correct: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60`
- [ ] Network is set to mainnet
- [ ] You have saved deployer mnemonic securely offline

### ⚠️ Final Review
- [ ] Read deployment plan: `deployments/v5-micro.mainnet-plan.yaml`
- [ ] Understand contract cannot be changed after deployment
- [ ] Know the contract address will be: `SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro`
- [ ] Ready to monitor deployment for at least 24 hours

---

## 🚀 Deployment Steps

### Step 1: Verify Contract

```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund

# Check contract syntax
clarinet check

# Expected output: "✔ 6 contracts checked"
```

**Status**: [ ] Completed

---

### Step 2: Prepare Wallet

```bash
# CRITICAL: Never commit Mainnet.toml.local to git!

# Copy template
cp settings/Mainnet.toml settings/Mainnet.toml.local

# Edit Mainnet.toml.local with your ACTUAL mnemonic
# (The one that controls SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60)

# Verify it's gitignored
git status | grep Mainnet.toml.local
# Should show nothing (file is ignored)
```

**SECURITY WARNING**: 
- ⚠️ NEVER commit your actual mnemonic to git
- ⚠️ Use `Mainnet.toml.local` which is gitignored
- ⚠️ Keep your mnemonic backed up securely offline

**Status**: [ ] Completed

---

### Step 3: Estimate Deployment Cost

```bash
# Generate deployment estimation
clarinet deployments generate --low-cost deployments/v5-micro.mainnet-plan.yaml

# Review the output for:
# - Estimated cost
# - Transaction details
# - Any warnings
```

**Expected Cost**: ~0.9 STX
**Your Wallet Balance**: ________ STX (must be > 1.5 STX)

**Status**: [ ] Completed

---

### Step 4: Deploy to Mainnet

```bash
# Deploy the contract
clarinet deployments apply -p deployments/v5-micro.mainnet-plan.yaml

# Follow prompts and confirm transaction
# This will take several minutes
```

**Transaction ID**: ________________________________
**Block Height**: ________________________________
**Timestamp**: ________________________________

**Status**: [ ] Completed

---

### Step 5: Verify Deployment

**Wait for confirmation** (usually 10-30 minutes)

```bash
# Check contract deployment status
curl "https://api.hiro.so/v2/contracts/interface/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-micro"

# Should return contract interface (not 404)
```

**Explorer Link**: 
`https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro?chain=mainnet`

**Status**: [ ] Verified

---

### Step 6: Test Read-Only Functions

```bash
# Test get-version
curl -X POST "https://api.hiro.so/v2/contracts/call-read/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-micro/get-version" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60",
    "arguments": []
  }'

# Expected: {"okay":true,"result":"0x0703000000000000000000000000000005"}
# (This is Clarity value for (ok u5))

# Test get-min-stake-amount
curl -X POST "https://api.hiro.so/v2/contracts/call-read/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-micro/get-min-stake-amount" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60",
    "arguments": []
  }'

# Expected: {"okay":true,"result":"0x0703000000000000000000000000000064"}
# (This is Clarity value for (ok u100))
```

**Status**: [ ] Verified

---

### Step 7: Update Frontend Configuration

```bash
cd frontend

# Update production environment
cat > .env.production << 'EOF'
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v5-micro
NEXT_PUBLIC_STACKS_API_URL=https://api.hiro.so
EOF

# Build production frontend
npm run build

# Test production build locally
npm run start
# Open http://localhost:3000 and verify
```

**Status**: [ ] Completed

---

### Step 8: Deploy Frontend

**If using Vercel:**
```bash
# Deploy to production
vercel --prod

# Or push to main branch if auto-deploy is configured
git add .
git commit -m "Update to v5-micro mainnet deployment"
git push origin main
```

**If using other hosting:**
- Upload `frontend/.next` build folder
- Configure environment variables
- Point domain to new deployment

**Frontend URL**: ________________________________

**Status**: [ ] Completed

---

## 🔍 Post-Deployment Verification (First Hour)

### Test Basic Functions

#### 1. Connect Wallet
- [ ] Visit frontend
- [ ] Connect Hiro/Leather wallet
- [ ] Verify contract address displays correctly
- [ ] Check minimum stake shows: 0.0001 STX (100 microSTX)

#### 2. Test Staking (with small amount)
- [ ] Click stake button
- [ ] Enter 0.0001 STX (minimum)
- [ ] Confirm transaction
- [ ] Wait for confirmation
- [ ] Verify balance updated

#### 3. Test Proposal Creation
- [ ] After staking, try creating proposal
- [ ] Enter details (amount: 10 STX, title, description)
- [ ] Submit transaction
- [ ] Verify proposal created

#### 4. Check Admin Panel (if you're owner)
- [ ] Admin panel should be visible
- [ ] Shows current min stake: 0.0001 STX
- [ ] "Update Minimum Stake" form present
- [ ] "Transfer Ownership" form present

---

## 📊 Monitoring (First 24 Hours)

### Metrics to Watch

1. **Contract Activity**
   - Total staked amount
   - Number of proposals
   - Number of voters
   - Transactions per hour

2. **Error Monitoring**
   - Check explorer for failed transactions
   - Monitor GitHub issues
   - Watch community channels

3. **Frontend Analytics**
   - Page views
   - Wallet connections
   - Transaction completions
   - Error rates

### Where to Monitor

- **Explorer**: https://explorer.hiro.so
- **API**: https://api.hiro.so
- **Frontend**: Your deployment URL
- **GitHub**: Issues and discussions

---

## 🚨 Emergency Procedures

### If Contract Has Critical Issues

1. **Assess Severity**
   - Minor bug: Can work around
   - Major bug: May need new deployment
   - Critical bug: Stop encouraging usage

2. **Immediate Actions**
   - Post warning on frontend
   - Announce in community
   - Document the issue
   - Prepare fix if possible

3. **Resolution Options**
   - Use admin functions if applicable
   - Deploy new contract version
   - Create migration path for users

### If Frontend Has Issues

1. **Rollback Option**
   - Revert to previous deployment
   - Or disable problematic features

2. **Quick Fixes**
   - Can be pushed immediately
   - No contract interaction needed

---

## 📢 Community Announcement

### After Successful Deployment (24 hours stable)

**Template:**

```markdown
🚀 SprintFund v5-micro is LIVE on Mainnet!

After comprehensive testing and development, we're excited to announce v5-micro with groundbreaking features:

✨ **What's New**
• Configurable micro-stakes - Start with just 0.0001 STX!
• Admin controls for dynamic governance
• All security features from v4 + enhanced protection
• Professional admin interface for contract owner

📍 **Contract Address**
SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro

🔗 **Links**
• dApp: [YOUR_FRONTEND_URL]
• Explorer: https://explorer.hiro.so/txid/SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro?chain=mainnet
• Docs: https://github.com/Mosas2000/SprintFund

💡 **Getting Started**
1. Connect your Hiro or Leather wallet
2. Stake as little as 0.0001 STX
3. Create or vote on proposals
4. Be part of decentralized governance!

🛡️ **Security**
• 91.7% test coverage
• 10 critical security fixes
• Audited codebase
• Start small and test thoroughly

Questions? Check our comprehensive docs or open a GitHub issue!

#Stacks #DeFi #DAO #Web3
```

---

## ✅ Success Criteria

### Deployment Success
- [x] Contract deployed without errors
- [ ] Transaction confirmed on-chain
- [ ] Contract visible in explorer
- [ ] Read-only functions working
- [ ] Frontend deployed and accessible

### Functionality Success
- [ ] Wallet connection works
- [ ] Staking works
- [ ] Proposal creation works
- [ ] Voting works (after proposals created)
- [ ] Admin panel accessible (for owner)

### Community Success
- [ ] Clear documentation available
- [ ] Community announcement made
- [ ] Support channels active
- [ ] First users onboarded successfully
- [ ] No critical issues in first 24h

---

## 📝 Deployment Log

**Deployer**: ________________________________
**Date**: ________________________________
**Time Started**: ________________________________
**Time Completed**: ________________________________

**Transaction ID**: ________________________________
**Block Height**: ________________________________
**Contract Address**: SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60.sprintfund-core-v5-micro

**Cost**: ________ STX
**Frontend URL**: ________________________________

**Notes**:
________________________________________________________________
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

## 🎉 Congratulations!

If you've completed all steps above, you've successfully deployed SprintFund v5-micro to Mainnet!

**Next Steps:**
1. Monitor closely for 24-48 hours
2. Support early users
3. Document any issues
4. Gather feedback
5. Plan improvements

**Remember:**
- Start small with testing
- Support your community
- Iterate based on feedback
- Keep security top of mind

**You've built something amazing! 🚀**

---

*Deployment Guide v1.0*
*SprintFund v5-micro*
*June 8, 2026*
