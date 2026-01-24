import { makeContractCall, broadcastTransaction, AnchorMode, stringUtf8CV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

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

async function logActivity(message, index) {
  try {
    const txOptions = {
      contractAddress: 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T',
      contractName: 'sprintfund-logger',
      functionName: 'log-activity',
      functionArgs: [stringUtf8CV(message)],
      senderKey: process.env.PRIVATE_KEY,
      network: new StacksMainnet(),
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractCall(txOptions);
    const result = await broadcastTransaction(transaction, new StacksMainnet());
    
    const logEntry = `LOG_${index}: ${result.txid} - ${message}\n`;
    fs.appendFileSync('../transactions.log', logEntry);
    
    console.log(`✅ #${index}: ${result.txid.slice(0, 10)}...`);
    return result.txid;
  } catch (error) {
    console.error(`❌ #${index} failed:`, error.message);
  }
}

async function runBatch(batchNum) {
  console.log(`\n🚀 Starting batch ${batchNum} (10 transactions)...`);
  
  for (let i = 0; i < 10; i++) {
    const index = (batchNum - 1) * 10 + i + 1;
    const message = activities[i % activities.length] + ` #${index}`;
    await logActivity(message, index);
    await new Promise(r => setTimeout(r, 2000)); // 2s delay
  }
  
  console.log(`✅ Batch ${batchNum} complete!\n`);
}

runBatch(10);
