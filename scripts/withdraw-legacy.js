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
  logDryRun,
  printUsage
} from './lib/script-utils.js';

dotenv.config();

/**
 * SprintFund Legacy Withdrawal Script
 * 
 * Allows users to withdraw their staked STX from the legacy v1 contract
 * (sprintfund-core) so they can re-stake in the active v3 version.
 */
async function withdrawLegacy() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/withdraw-legacy.js [options]');
    console.log('\nOptions:');
    console.log('  --amount <microSTX>  Amount to withdraw (required)');
    console.log('  --network <name>     Network to use (mainnet/testnet, default: mainnet)');
    console.log('  --dry-run            Show transaction details without broadcasting');
    console.log('  --skip-confirm       Skip confirmation prompt on mainnet');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  
  const keyResult = validatePrivateKey(process.env.PRIVATE_KEY);
  if (!keyResult.valid) {
    console.error(`ERROR: ${keyResult.error}`);
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  const privateKey = keyResult.key;
  const contractAddress = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
  const contractName = 'sprintfund-core'; // Legacy contract
  const amount = options.amount ? parseInt(options.amount, 10) : 0;
  
  if (!amount || amount <= 0) {
    console.error('ERROR: You must specify a valid amount to withdraw using --amount <microSTX>');
    process.exit(1);
  }
  
  console.log('============================================');
  console.log('SprintFund Legacy Withdrawal (V1)');
  console.log('============================================\n');
  console.log(`Network: ${options.network}`);
  console.log(`Contract: ${contractAddress}.${contractName}`);
  console.log('Function: withdraw-stake\n');
  console.log(`Withdrawing: ${amount / 1000000} STX\n`);
  console.log('Note: This targets the DEPRECATED v1 contract.\n');
  console.log('============================================\n');

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'withdraw-stake',
    functionArgs: [
      uintCV(amount)
    ],
    senderKey: privateKey,
    validateWithAbi: true,
    network,
    anchorMode: AnchorMode.Any,
    fee: 15000 // Slightly higher fee for legacy cleanup
  };

  if (options.dryRun) {
    logDryRun({
      action: 'Withdraw from V1',
      network: options.network,
      contract: `${contractAddress}.${contractName}`,
      function: 'withdraw-stake',
      args: {
        amount: `${amount / 1000000} STX`
      },
      fee: '0.015 STX'
    });
    return;
  }

  if (options.network === 'mainnet' && !options.skipConfirm) {
    const confirmed = await confirmMainnetTransaction({
      action: 'Withdraw Legacy Stake',
      contract: `${contractAddress}.${contractName}`,
      function: 'withdraw-stake',
      amount: `${amount / 1000000} STX`,
      fee: '0.015 STX'
    });
    if (!confirmed) {
      console.log('Transaction cancelled.\n');
      process.exit(0);
    }
  }

  try {
    console.log('Building transaction...');
    const transaction = await makeContractCall(txOptions);
    
    console.log(`Broadcasting transaction to ${options.network}...\n`);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    
    if (broadcastResponse.error) {
      console.error('ERROR:', broadcastResponse.error);
      process.exit(1);
    }
    
    const txId = broadcastResponse.txid;
    
    console.log('============================================');
    console.log('Withdrawal transaction broadcast successfully!');
    console.log('============================================');
    console.log(`Transaction ID: ${txId}\n`);
    console.log('Track your transaction:');
    console.log(getExplorerUrl(options.network, txId) + '\n');
    console.log('Once confirmed, you can re-stake in V3 using stake.js\n');
    
    return txId;
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

withdrawLegacy();
