import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import {
  parseArgs,
  getNetwork,
  getExplorerUrl,
  validatePrivateKey,
  confirmMainnetTransaction,
  logDryRun
} from './lib/script-utils.js';
import {
  getContractAddress,
  getContractName,
  getContractConfig
} from './lib/contract-config.js';

dotenv.config();

/**
 * Migrate Stake Script
 * 
 * Automates the migration process:
 * 1. Withdraws stake from legacy contract
 * 2. Stakes in new contract
 * 3. Optionally claims reputation
 */
async function migrateStake() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/migrate-stake.js [options]');
    console.log('\nOptions:');
    console.log('  --amount <microSTX>    Amount to migrate (required)');
    console.log('  --from-version <v1|v2> Legacy version to migrate from (default: v1)');
    console.log('  --network <name>       Network to use (mainnet/testnet, default: mainnet)');
    console.log('  --claim-reputation     Also claim reputation from legacy contract');
    console.log('  --dry-run              Show transaction details without broadcasting');
    console.log('  --skip-confirm         Skip confirmation prompt on mainnet');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  const config = getContractConfig();
  
  const keyResult = validatePrivateKey(process.env.PRIVATE_KEY);
  if (!keyResult.valid) {
    console.error(`ERROR: ${keyResult.error}`);
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  const privateKey = keyResult.key;
  const contractAddress = getContractAddress();
  const newContractName = getContractName();
  const amount = options.amount ? parseInt(options.amount, 10) : 0;
  
  if (!amount || amount <= 0) {
    console.error('ERROR: You must specify a valid amount to migrate using --amount <microSTX>');
    process.exit(1);
  }

  const fromVersion = options.fromVersion || 'v1';
  const legacyContractName = config.legacy[fromVersion]?.name;
  
  if (!legacyContractName) {
    console.error(`ERROR: Unknown legacy version: ${fromVersion}`);
    console.error('Available versions:', Object.keys(config.legacy).join(', '));
    process.exit(1);
  }

  const claimReputation = options.claimReputation || false;
  
  console.log('============================================');
  console.log('SprintFund Stake Migration');
  console.log('============================================\n');
  console.log(`Network: ${options.network}`);
  console.log(`From: ${contractAddress}.${legacyContractName}`);
  console.log(`To: ${contractAddress}.${newContractName}`);
  console.log(`Amount: ${amount / 1000000} STX`);
  console.log(`Claim Reputation: ${claimReputation ? 'Yes' : 'No'}\n`);
  console.log('Migration Steps:');
  console.log('  1. Withdraw from legacy contract');
  console.log('  2. Stake in new contract');
  if (claimReputation) {
    console.log('  3. Claim reputation');
  }
  console.log('\n============================================\n');

  if (options.dryRun) {
    logDryRun({
      action: 'Migrate Stake',
      network: options.network,
      steps: [
        {
          step: 1,
          contract: `${contractAddress}.${legacyContractName}`,
          function: 'withdraw-stake',
          args: { amount: `${amount / 1000000} STX` },
          fee: '~0.015 STX'
        },
        {
          step: 2,
          contract: `${contractAddress}.${newContractName}`,
          function: 'stake',
          args: { amount: `${amount / 1000000} STX` },
          fee: '~0.010 STX'
        }
      ],
      totalFee: claimReputation ? '~0.030 STX' : '~0.025 STX'
    });
    return;
  }

  if (options.network === 'mainnet' && !options.skipConfirm) {
    const confirmed = await confirmMainnetTransaction({
      action: 'Migrate Stake',
      from: `${contractAddress}.${legacyContractName}`,
      to: `${contractAddress}.${newContractName}`,
      amount: `${amount / 1000000} STX`,
      fee: claimReputation ? '~0.030 STX' : '~0.025 STX'
    });
    if (!confirmed) {
      console.log('Migration cancelled.\n');
      process.exit(0);
    }
  }

  const transactions = [];

  try {
    // Step 1: Withdraw from legacy contract
    console.log('Step 1/2: Withdrawing from legacy contract...');
    
    const withdrawTx = await makeContractCall({
      contractAddress,
      contractName: legacyContractName,
      functionName: 'withdraw-stake',
      functionArgs: [uintCV(amount)],
      senderKey: privateKey,
      validateWithAbi: true,
      network,
      anchorMode: AnchorMode.Any,
      fee: 15000
    });
    
    const withdrawResponse = await broadcastTransaction(withdrawTx, network);
    
    if (withdrawResponse.error) {
      console.error('ERROR withdrawing from legacy contract:', withdrawResponse.error);
      process.exit(1);
    }
    
    const withdrawTxId = withdrawResponse.txid;
    transactions.push({ step: 'withdraw', txId: withdrawTxId });
    console.log(`✓ Withdrawal transaction broadcast: ${withdrawTxId}`);
    console.log(`  Track: ${getExplorerUrl(options.network, withdrawTxId)}\n`);

    // Wait a bit for withdrawal to confirm
    console.log('Waiting for withdrawal confirmation (30 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Step 2: Stake in new contract
    console.log('Step 2/2: Staking in new contract...');
    
    const stakeTx = await makeContractCall({
      contractAddress,
      contractName: newContractName,
      functionName: 'stake',
      functionArgs: [uintCV(amount)],
      senderKey: privateKey,
      validateWithAbi: true,
      network,
      anchorMode: AnchorMode.Any,
      fee: 10000
    });
    
    const stakeResponse = await broadcastTransaction(stakeTx, network);
    
    if (stakeResponse.error) {
      console.error('ERROR staking in new contract:', stakeResponse.error);
      console.log('\n⚠️  Withdrawal succeeded but staking failed.');
      console.log('Your STX has been withdrawn from the legacy contract.');
      console.log('You can manually stake using: node scripts/stake.js --amount', amount);
      process.exit(1);
    }
    
    const stakeTxId = stakeResponse.txid;
    transactions.push({ step: 'stake', txId: stakeTxId });
    console.log(`✓ Stake transaction broadcast: ${stakeTxId}`);
    console.log(`  Track: ${getExplorerUrl(options.network, stakeTxId)}\n`);

    // Step 3: Claim reputation (optional)
    if (claimReputation) {
      console.log('Waiting for stake confirmation (30 seconds)...');
      await new Promise(resolve => setTimeout(resolve, 30000));

      console.log('Step 3/3: Claiming reputation...');
      
      // Note: This assumes the new contract has a claim-legacy-reputation function
      // Implementation may vary based on actual contract design
      try {
        const claimTx = await makeContractCall({
          contractAddress,
          contractName: newContractName,
          functionName: 'claim-legacy-reputation',
          functionArgs: [],
          senderKey: privateKey,
          validateWithAbi: true,
          network,
          anchorMode: AnchorMode.Any,
          fee: 5000
        });
        
        const claimResponse = await broadcastTransaction(claimTx, network);
        
        if (claimResponse.error) {
          console.error('WARNING: Reputation claim failed:', claimResponse.error);
          console.log('Migration completed but reputation was not claimed.');
          console.log('You may need to claim reputation manually.\n');
        } else {
          const claimTxId = claimResponse.txid;
          transactions.push({ step: 'claim-reputation', txId: claimTxId });
          console.log(`✓ Reputation claim transaction broadcast: ${claimTxId}`);
          console.log(`  Track: ${getExplorerUrl(options.network, claimTxId)}\n`);
        }
      } catch (error) {
        console.error('WARNING: Reputation claim error:', error.message);
        console.log('Migration completed but reputation was not claimed.\n');
      }
    }

    // Summary
    console.log('============================================');
    console.log('Migration Complete!');
    console.log('============================================\n');
    console.log('Transactions:');
    transactions.forEach(tx => {
      console.log(`  ${tx.step}: ${tx.txId}`);
    });
    console.log('\nYour stake has been migrated to the new contract.');
    console.log('Transactions may take 10-30 minutes to confirm.\n');
    console.log('You can now participate in governance using the new contract.\n');
    
    return transactions;
  } catch (error) {
    console.error('ERROR during migration:', error.message);
    console.log('\nMigration failed. Please check the error and try again.');
    console.log('If you need assistance, contact support with the error message above.\n');
    process.exit(1);
  }
}

migrateStake();
