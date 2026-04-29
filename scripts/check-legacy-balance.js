import { 
  callReadOnlyFunction, 
  cvToValue,
  standardPrincipalCV
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import {
  parseArgs,
  getNetwork,
  printUsage
} from './lib/script-utils.js';
import {
  getContractAddress,
  getContractConfig
} from './lib/contract-config.js';

dotenv.config();

/**
 * Check Legacy Balance Script
 * 
 * Checks if a user has staked STX or reputation in legacy contract versions.
 * Useful for identifying users who need to migrate.
 */
async function checkLegacyBalance() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/check-legacy-balance.js [options]');
    console.log('\nOptions:');
    console.log('  --address <principal>  User address to check (required)');
    console.log('  --network <name>       Network to use (mainnet/testnet, default: mainnet)');
    console.log('  --version <v1|v2>      Legacy version to check (default: v1)');
    console.log('  --json                 Output in JSON format');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  const config = getContractConfig();
  const contractAddress = getContractAddress();
  
  const userAddress = options.address;
  if (!userAddress) {
    console.error('ERROR: You must specify a user address using --address <principal>');
    process.exit(1);
  }

  // Validate address format
  if (!userAddress.startsWith('SP') && !userAddress.startsWith('ST')) {
    console.error('ERROR: Invalid Stacks address format');
    process.exit(1);
  }

  const legacyVersion = options.version || 'v1';
  const legacyContractName = config.legacy[legacyVersion]?.name;
  
  if (!legacyContractName) {
    console.error(`ERROR: Unknown legacy version: ${legacyVersion}`);
    console.error('Available versions:', Object.keys(config.legacy).join(', '));
    process.exit(1);
  }

  if (!options.json) {
    console.log('============================================');
    console.log('Legacy Balance Check');
    console.log('============================================\n');
    console.log(`Network: ${options.network}`);
    console.log(`User: ${userAddress}`);
    console.log(`Legacy Contract: ${contractAddress}.${legacyContractName}`);
    console.log(`Status: ${config.legacy[legacyVersion].status}\n`);
    console.log('============================================\n');
  }

  try {
    // Check staked balance
    const stakeResult = await callReadOnlyFunction({
      contractAddress,
      contractName: legacyContractName,
      functionName: 'get-stake',
      functionArgs: [standardPrincipalCV(userAddress)],
      network,
      senderAddress: userAddress,
    });

    const stakeValue = cvToValue(stakeResult);
    const stakedAmount = stakeValue.value || 0;

    // Check reputation
    let reputation = 0;
    try {
      const repResult = await callReadOnlyFunction({
        contractAddress,
        contractName: legacyContractName,
        functionName: 'get-reputation',
        functionArgs: [standardPrincipalCV(userAddress)],
        network,
        senderAddress: userAddress,
      });

      const repValue = cvToValue(repResult);
      reputation = repValue.value || 0;
    } catch (error) {
      // Reputation function might not exist in all versions
      reputation = 0;
    }

    // Check vote locks
    let hasActiveLocks = false;
    let lockInfo = null;
    try {
      const lockResult = await callReadOnlyFunction({
        contractAddress,
        contractName: legacyContractName,
        functionName: 'get-vote-lock',
        functionArgs: [standardPrincipalCV(userAddress)],
        network,
        senderAddress: userAddress,
      });

      const lockValue = cvToValue(lockResult);
      if (lockValue.value) {
        lockInfo = lockValue.value;
        hasActiveLocks = lockInfo.amount > 0;
      }
    } catch (error) {
      // Lock function might not exist in all versions
      hasActiveLocks = false;
    }

    const result = {
      address: userAddress,
      network: options.network,
      legacyVersion,
      contractName: legacyContractName,
      stakedAmount,
      stakedSTX: stakedAmount / 1000000,
      reputation,
      hasActiveLocks,
      lockInfo,
      needsMigration: stakedAmount > 0 || reputation > 0,
      canMigrateNow: (stakedAmount > 0 || reputation > 0) && !hasActiveLocks
    };

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('Results:');
      console.log('--------\n');
      console.log(`Staked Amount: ${result.stakedSTX} STX (${stakedAmount} microSTX)`);
      console.log(`Reputation: ${reputation}`);
      console.log(`Active Vote Locks: ${hasActiveLocks ? 'Yes' : 'No'}`);
      
      if (lockInfo && hasActiveLocks) {
        console.log(`\nLock Details:`);
        console.log(`  Locked Amount: ${lockInfo.amount / 1000000} STX`);
        console.log(`  Unlock Height: ${lockInfo.unlockHeight}`);
      }

      console.log(`\nMigration Status:`);
      console.log(`  Needs Migration: ${result.needsMigration ? 'Yes' : 'No'}`);
      console.log(`  Can Migrate Now: ${result.canMigrateNow ? 'Yes' : 'No'}`);

      if (result.needsMigration && !result.canMigrateNow) {
        console.log(`\n⚠️  Migration blocked by active vote locks`);
        console.log(`   Wait for locks to expire before migrating`);
      } else if (result.needsMigration) {
        console.log(`\n✓ Ready to migrate!`);
        console.log(`  Run: node scripts/migrate-stake.js --amount ${stakedAmount}`);
      } else {
        console.log(`\n✓ No assets in legacy contract`);
      }

      console.log('\n============================================\n');
    }

    return result;
  } catch (error) {
    if (options.json) {
      console.error(JSON.stringify({ error: error.message }, null, 2));
    } else {
      console.error('ERROR:', error.message);
    }
    process.exit(1);
  }
}

checkLegacyBalance();
