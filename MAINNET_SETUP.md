# SprintFund Mainnet Test Proposal Setup

This guide provides multiple methods to create a test proposal on the SprintFund mainnet contract.

## 📋 Quick Reference

- **Contract**: `SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core`
- **Function**: `create-proposal`
- **Test Parameters**:
  - Amount: `u50000000` (50 STX)
  - Title: "Test Proposal 1"
  - Description: "Testing SprintFund proposal creation for Builder Rewards program"
- **Expected Cost**: ~0.01 STX

---

## ⚠️ IMPORTANT: Stake First!

Before creating any proposal, you **MUST** stake at least **10 STX** in the contract:

```bash
# Using Stacks CLI
stx call_contract_func \
  SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T \
  sprintfund-core \
  stake \
  10000 \
  0 \
  "$PAYMENT_KEY" \
  'u10000000'

# OR using the Node.js script
cd scripts && npm run stake
```

---

## 🚀 Methods to Create Proposal

### Method 1: Node.js Scripts (Recommended)

**Easiest and most automated approach**

```bash
# 1. Install dependencies
cd scripts
npm install

# 2. Configure your private key
cp .env.example .env
# Edit .env and add your private key

# 3. Stake STX (if not done already)
npm run stake
# Wait for confirmation (~10 minutes)

# 4. Create proposal
npm run create-proposal
```

✅ **Advantages**: 
- Fully automated
- Automatic transaction logging
- Error handling
- Clean output

📁 **Files Created**:
- Transaction ID saved to `transactions.log`
- Format: `TX1: <txid> - Create Test Proposal`

---

### Method 2: Bash Script (Stacks CLI)

**For command-line users**

```bash
# 1. Set your private key
export PAYMENT_KEY="your-private-key-here"

# 2. Run the script
./create-test-proposal.sh
```

✅ **Advantages**:
- No dependencies to install
- Works with existing Stacks CLI
- Simple and fast

---

### Method 3: Manual Stacks CLI

**For maximum control**

```bash
# Set your key
export PAYMENT_KEY="your-private-key-here"

# Get your nonce from explorer
# https://explorer.hiro.so/address/YOUR_ADDRESS?chain=mainnet

# Create proposal
stx call_contract_func \
  SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T \
  sprintfund-core \
  create-proposal \
  10000 \
  YOUR_NONCE \
  "$PAYMENT_KEY" \
  'u50000000, "Test Proposal 1", "Testing SprintFund proposal creation for Builder Rewards program"'

# Manually save TX ID to transactions.log
echo "TX1: YOUR_TX_ID - Create Test Proposal" >> transactions.log
```

---

### Method 4: Hiro Wallet (Browser)

**For non-technical users**

1. Install [Hiro Wallet](https://wallet.hiro.so/)
2. Visit the [contract on explorer](https://explorer.hiro.so/txid/SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-core?chain=mainnet)
3. Click "Functions" → `create-proposal`
4. Enter parameters:
   - **amount**: `50000000`
   - **title**: Test Proposal 1
   - **description**: Testing SprintFund proposal creation for Builder Rewards program
5. Click "Call function"
6. Approve in wallet
7. Manually save TX ID to `transactions.log`

---

## 📝 Transaction Log Format

All transactions should be logged to `transactions.log`:

```
TX1: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef - Create Test Proposal
```

---

## 🔍 Tracking Your Transaction

After broadcasting, track on Stacks Explorer:
```
https://explorer.hiro.so/txid/<YOUR_TX_ID>?chain=mainnet
```

Typical confirmation time: **10-15 minutes**

---

## 📚 Documentation Files

- `CREATE_PROPOSAL_GUIDE.md` - Detailed guide with all methods
- `scripts/README.md` - Node.js scripts documentation
- `transactions.log` - Transaction history log

---

## ✅ Success Checklist

- [ ] Have at least 10.01 STX in wallet (10 for stake + fees)
- [ ] Stake 10 STX in contract
- [ ] Wait for stake confirmation (~10 min)
- [ ] Create proposal using preferred method
- [ ] Save transaction ID to `transactions.log`
- [ ] Track transaction on explorer

---

## 🐛 Common Issues

| Error | Solution |
|-------|----------|
| `ERR-INSUFFICIENT-STAKE` | Stake 10 STX first using the stake function |
| Transaction failed | Check you have enough STX for fees |
| Invalid nonce | Get current nonce from explorer |
| Module not found | Run `npm install` in scripts directory |

---

## 📁 Project Structure

```
sprintfund/
├── CREATE_PROPOSAL_GUIDE.md      # Comprehensive guide
├── MAINNET_SETUP.md             # This file
├── create-test-proposal.sh       # Bash script
├── transactions.log              # Transaction log
└── scripts/
    ├── package.json
    ├── create-proposal.js        # Node.js proposal script
    ├── stake.js                  # Node.js stake script
    ├── .env.example
    └── README.md
```

---

## 🔐 Security Notes

- **Never commit private keys** to git
- `.env` files are in `.gitignore`
- Use separate wallets for testing
- Mainnet transactions cost real STX

---

## 💡 Next Steps

After successful proposal creation:
1. View your proposal on explorer
2. Test voting functionality
3. Execute proposal after voting period
4. Document results

---

## 📞 Support

For issues with:
- **Contract**: Check [sprintfund-core.clar](contracts/sprintfund-core.clar)
- **Scripts**: See [scripts/README.md](scripts/README.md)
- **General**: See [CREATE_PROPOSAL_GUIDE.md](CREATE_PROPOSAL_GUIDE.md)
