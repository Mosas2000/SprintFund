# ⚡ Quick Testnet Deployment

## 3 Steps to Test v5-ultra (5 minutes)

### 1. Get Free Testnet STX (2 minutes)
```bash
# Visit faucet
open "https://explorer.hiro.so/sandbox/faucet?chain=testnet"

# Enter your testnet address, click "Request STX"
# You'll get 500 testnet STX (free!)
```

### 2. Configure Testnet Wallet (1 minute)
```bash
# Edit Testnet.toml
nano settings/Testnet.toml

# Replace mnemonic with your testnet wallet's mnemonic
# Save and exit (Ctrl+X, Y, Enter)
```

### 3. Deploy to Testnet (2-10 minutes)
```bash
cd /Users/macosbigsur/Documents/Code/Stacks-project/SprintFund/sprintfund
clarinet deployments apply -p deployments/v5-ultra.testnet-plan.yaml
```

---

## Then What?

### ✅ If It Works
- Test the functions
- Deploy same contract to mainnet
- Launch! 🚀

### ❌ If It Fails  
- We know the workaround doesn't work
- Deploy v4-minimal to mainnet instead (guaranteed to work)
- Launch with 10 STX min-stake for now

---

## Why This is Smart

- **Cost**: FREE (vs 0.8 STX on mainnet)
- **Risk**: ZERO (it's testnet!)
- **Savings**: 2.4+ STX if multiple attempts needed

**Already spent**: 3.2 STX on failed mainnet deployments  
**Testing first**: Save your remaining STX!

---

## Need Testnet Wallet?

**Option 1: Hiro Wallet** (Recommended)
1. Install Hiro Wallet extension
2. Create new account or use existing
3. Switch to Testnet mode (Settings → Network → Testnet)
4. Copy your testnet address
5. Get STX from faucet

**Option 2: Generate with Clarinet**
```bash
# Clarinet can generate a testnet wallet
clarinet integrate
```

---

## Faucet Links

- Primary: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- Alternative: https://stacks-faucet.vercel.app/

---

## Quick Verify

After deployment, check if it worked:

```bash
# Check contract exists
curl "https://api.testnet.hiro.so/v2/contracts/interface/ST1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60/sprintfund-core-v5-ultra" | grep -q "sprintfund" && echo "✅ DEPLOYED!" || echo "❌ Failed"
```

---

**Read TESTNET_FIRST.md for full details**

**Let's test on testnet first! Smart move! 🧠**
