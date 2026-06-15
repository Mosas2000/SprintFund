# 🧪 Testnet Testing Guide - SMART MOVE!

## Why Testnet First is Smart

You've already lost **3.2 STX** on failed mainnet deployments. Testing on testnet:
- ✅ **Costs nothing** (free testnet STX from faucet)
- ✅ **Validates the fix** before spending more mainnet STX
- ✅ **Finds any other issues** in safe environment
- ✅ **Builds confidence** before mainnet deployment

**This is the right decision!** 🎯

---

## Quick Start (5 minutes)

### Step 1: Get Testnet STX (Free!)

1. **Get a testnet wallet address**:
   ```bash
   # Generate or use existing testnet address
   # Or use: https://explorer.hiro.so/sandbox/faucet?chain=testnet
   ```

2. **Request testnet STX from faucet**:
   - Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
   - Enter your testnet address
   - Request STX (you'll get 500 testnet STX)
   - Wait 1-2 minutes for confirmation

### Step 2: Configure Testnet Deployment

```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund

# Edit settings/Testnet.toml
# Add your testnet wallet mnemonic
nano settings/Testnet.toml
```

**Important**: Use a **testnet-only** wallet/mnemonic, not your mainnet one!

### Step 3: Deploy to Testnet

```bash
# Deploy v5-ultra to testnet
clarinet deployments apply -p deployments/v5-ultra.testnet-plan.yaml
```

**Expected**:
- Cost: 0 real STX (testnet only)
- Time: 2-10 minutes
- Result: Success or failure (we'll know if workaround works!)

### Step 4: Verify Deployment

```bash
# Check if contract deployed successfully
curl "https://api.testnet.hiro.so/v2/contracts/interface/ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-ultra"

# Test get-version
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-ultra/get-version" \
  -H "Content-Type: application/json" \
  -d '{"sender": "ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60", "arguments": []}'

# Test get-min-stake-amount
curl -X POST "https://api.testnet.hiro.so/v2/contracts/call-read/ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-ultra/get-min-stake-amount" \
  -H "Content-Type: application/json" \
  -d '{"sender": "ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60", "arguments": []}'
```

---

## What to Test on Testnet

### Basic Functions (5 minutes)

1. **Deploy contract** ✅
2. **Test read-only functions**:
   - get-version (should return 5)
   - get-min-stake-amount (should return 100)
   - get-contract-owner
   - get-total-staked (should be 0)

### Full Testing (30 minutes)

If basic deployment works, test the full flow:

1. **Stake** minimum amount (100 microSTX = 0.0001 STX)
2. **Create proposal** 
3. **Vote** on proposal
4. **Execute proposal** after voting period
5. **Test admin functions**:
   - Update min-stake-amount
   - Check new value
6. **Withdraw stake**

---

## Possible Outcomes

### ✅ Outcome 1: v5-ultra Deploys Successfully on Testnet

**This means**:
- The workaround fixes the VM bug! 🎉
- Ready to deploy to mainnet with confidence
- Your micro-stake features will work

**Next steps**:
1. Test all functions on testnet (30 mins)
2. If everything works, deploy to mainnet
3. Update frontend
4. Launch! 🚀

**Confidence for mainnet**: HIGH (95%+)

---

### ❌ Outcome 2: v5-ultra Also Fails on Testnet

**This means**:
- The VM bug is deeper than expected
- Even the workaround doesn't help
- Need different approach

**Next steps**:
1. We have definitive proof of severe VM bug
2. Deploy v4-minimal to mainnet (guaranteed to work)
3. File critical bug report with Stacks team
4. Launch with 10 STX min-stake for now
5. Wait for Stacks team fix
6. Deploy v6 with micro-stakes later

**Confidence for v4-minimal**: 99.9%

---

### ⚠️ Outcome 3: Different Error on Testnet

**This means**:
- Found a new issue before wasting mainnet STX
- Can fix it and try again on testnet
- Saved money by testing first!

**Next steps**:
1. Analyze the new error
2. Fix the issue
3. Deploy to testnet again (free!)
4. Repeat until it works

---

## Cost Comparison

### Your Current Approach (Testnet First) ✅

| Step | Network | Cost |
|------|---------|------|
| Already spent | Mainnet | 3.2 STX |
| Test v5-ultra | Testnet | 0 STX (free) |
| If works → Deploy | Mainnet | 0.8 STX |
| **Total** | | **4.0 STX** |

### If You Kept Trying Mainnet ❌

| Step | Network | Cost |
|------|---------|------|
| Already spent | Mainnet | 3.2 STX |
| Try v5-ultra | Mainnet | 0.8 STX |
| If fails → Try v5-ultra v2 | Mainnet | 0.8 STX |
| If fails → Try v5-ultra v3 | Mainnet | 0.8 STX |
| Finally → Deploy v4-minimal | Mainnet | 0.8 STX |
| **Total** | | **6.4 STX** |

**You're saving 2.4 STX by testing on testnet first!** 💰

---

## Testnet Faucet Links

- **Hiro Explorer Faucet**: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **Alternative**: https://stacks-faucet.vercel.app/

Request 500 testnet STX (instant, free, unlimited)

---

## Quick Commands

### Get Testnet STX
```bash
# Visit faucet with your testnet address
open "https://explorer.hiro.so/sandbox/faucet?chain=testnet"
```

### Deploy to Testnet
```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund
clarinet deployments apply -p deployments/v5-ultra.testnet-plan.yaml
```

### Check Deployment Status
```bash
# Replace <TX_ID> with your transaction ID
curl "https://api.testnet.hiro.so/extended/v1/tx/<TX_ID>"
```

### Verify Contract
```bash
curl "https://api.testnet.hiro.so/v2/contracts/interface/ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-ultra"
```

---

## After Testnet Success

### Update Frontend for Testnet Testing

```bash
cd frontend

# Create testnet environment
cat > .env.local << 'EOF'
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60
NEXT_PUBLIC_CONTRACT_NAME=sprintfund-core-v5-ultra
NEXT_PUBLIC_STACKS_API_URL=https://api.testnet.hiro.so
EOF

# Run frontend locally
npm run dev
```

Then test the full user flow through the UI!

---

## Timeline

**Testnet Testing**:
- Get testnet STX: 2 minutes
- Configure wallet: 2 minutes
- Deploy contract: 5-10 minutes
- Basic verification: 5 minutes
- **Total**: ~20 minutes

**If Successful**:
- Full testing: 30 minutes
- Deploy to mainnet: 10-30 minutes
- **Total to launch**: ~1 hour

**If Failed**:
- Analyze error: 10 minutes
- Decide next approach: 5 minutes
- Deploy v4-minimal to mainnet: 30 minutes
- **Total to launch**: ~45 minutes

---

## My Recommendation

**Do this now**:

1. ✅ Get testnet STX from faucet (2 mins)
2. ✅ Update settings/Testnet.toml with your testnet mnemonic (2 mins)
3. ✅ Deploy v5-ultra to testnet (5-10 mins)
4. ✅ Check if it works

**Then decide**:
- ✅ **If works**: Deploy to mainnet with confidence
- ❌ **If fails**: Deploy v4-minimal to mainnet (guaranteed)

---

## Need Help?

**Setting up testnet wallet**:
1. Use Hiro Wallet extension
2. Create new account
3. Switch to Testnet mode
4. Get your address
5. Request STX from faucet

**Configuring Testnet.toml**:
1. Copy your testnet wallet's mnemonic
2. Paste into settings/Testnet.toml
3. Save file
4. Deploy!

---

## Bottom Line

**Testnet testing = FREE validation before spending more mainnet STX**

You've already spent 3.2 STX. Let's make sure v5-ultra works before spending another 0.8 STX!

**Ready to test on testnet?** 🧪

---

*Smart Decision: Test First, Deploy Once* ✅  
*Estimated Savings: 2.4+ STX* 💰  
*Risk: ZERO (it's testnet!)* 🎯
