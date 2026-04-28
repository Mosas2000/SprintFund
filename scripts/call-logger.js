import { makeContractCall, broadcastTransaction, AnchorMode, stringUtf8CV } from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {
  parseArgs,
  getNetwork,
  getExplorerUrl,
  validatePrivateKey,
  confirmMainnetTransaction,
  logDryRun,
  printUsage
} from './lib/script-utils.js';
import {
  getContractAddress
} from './lib/contract-config.js';

dotenv.config();

const activities = [
  "SprintFund development activity",
  "Testing logger functionality",
  "On-chain transaction test",
  "Builder Rewards tracking",
  "Contract interaction log",
  "Mainnet activity record",
  "DAO proposal system work",
  "Frontend integration test",
  "Smart contract call",
  "Platform development log"
];

async function logActivity(message, index, options, network) {
  const keyResult = validatePrivateKey(process.env.PRIVATE_KEY);
  if (!keyResult.valid) {
    throw new Error(keyResult.error);
  }

  const contractAddress = getContractAddress();
  const contractName = 'sprintfund-logger';
  
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'log-activity',
    functionArgs: [stringUtf8CV(message)],
    senderKey: keyResult.key,
    network,
    anchorMode: AnchorMode.Any,
  };

  if (options.dryRun) {
    console.log(`[DRY RUN] #${index}: Would log "${message}"`);
    return 'dry-run-txid';
  }

  try {
    const transaction = await makeContractCall(txOptions);
    const result = await broadcastTransaction(transaction, network);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    const logEntry = `LOG_${index}: ${result.txid} - ${message} (${options.network})\n`;
    fs.appendFileSync('../transactions.log', logEntry);
    
    console.log(`#${index}: ${result.txid.slice(0, 10)}...`);
    return result.txid;
  } catch (error) {
    console.error(`#${index} failed:`, error.message);
    throw error;
  }
}

async function runBatch(batchNum, options, network) {
  console.log(`\nStarting batch ${batchNum} (10 transactions)...`);
  console.log(`Network: ${options.network}`);
  if (options.dryRun) {
    console.log('Mode: DRY RUN\n');
  } else {
    console.log('');
  }
  
  for (let i = 0; i < 10; i++) {
    const index = (batchNum - 1) * 10 + i + 1;
    const message = activities[i % activities.length] + ` #${index}`;
    await logActivity(message, index, options, network);
    if (!options.dryRun) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log(`\nBatch ${batchNum} complete!\n`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage('call-logger.js', '  --batch=N         Batch number to run (default: 10)');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  
  let batchNum = 10;
  for (const arg of args) {
    if (arg.startsWith('--batch=')) {
      batchNum = parseInt(arg.split('=')[1], 10);
    }
  }

  const keyResult = validatePrivateKey(process.env.PRIVATE_KEY);
  if (!keyResult.valid) {
    console.error(`ERROR: ${keyResult.error}`);
    console.log('\nPlease create a .env file with:');
    console.log('PRIVATE_KEY=your-private-key-here\n');
    process.exit(1);
  }

  if (options.network === 'mainnet' && !options.skipConfirm && !options.dryRun) {
    const confirmed = await confirmMainnetTransaction({
      action: `Log Activity Batch ${batchNum}`,
      contract: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T.sprintfund-logger',
      function: 'log-activity (x10)'
    });
    if (!confirmed) {
      console.log('Transaction cancelled.\n');
      process.exit(0);
    }
  }

  await runBatch(batchNum, options, network);
}

main();
