import { 
  callReadOnlyFunction, 
  cvToValue,
  standardPrincipalCV
} from '@stacks/transactions';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import {
  parseArgs,
  getNetwork
} from './lib/script-utils.js';
import {
  getContractAddress,
  getContractConfig
} from './lib/contract-config.js';

dotenv.config();

/**
 * Migration Report Script
 * 
 * Generates a report of migration status across all known users.
 * Useful for tracking migration progress and identifying users who need assistance.
 */
async function generateMigrationReport() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node scripts/migration-report.js [options]');
    console.log('\nOptions:');
    console.log('  --addresses <file>     File containing user addresses (one per line)');
    console.log('  --network <name>       Network to use (mainnet/testnet, default: mainnet)');
    console.log('  --version <v1|v2>      Legacy version to check (default: v1)');
    console.log('  --output <file>        Output file for report (default: migration-report.json)');
    console.log('  --format <json|csv>    Output format (default: json)');
    process.exit(0);
  }

  const options = parseArgs(args);
  const network = getNetwork(options.network);
  const config = getContractConfig();
  const contractAddress = getContractAddress();
  
  const addressFile = options.addresses;
  if (!addressFile) {
    console.error('ERROR: You must specify an address file using --addresses <file>');
    console.log('\nCreate a file with one Stacks address per line:');
    console.log('SP1234...');
    console.log('SP5678...');
    process.exit(1);
  }

  if (!fs.existsSync(addressFile)) {
    console.error(`ERROR: Address file not found: ${addressFile}`);
    process.exit(1);
  }

  const addresses = fs.readFileSync(addressFile, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && (line.startsWith('SP') || line.startsWith('ST')));

  if (addresses.length === 0) {
    console.error('ERROR: No valid addresses found in file');
    process.exit(1);
  }

  const legacyVersion = options.version || 'v1';
  const legacyContractName = config.legacy[legacyVersion]?.name;
  
  if (!legacyContractName) {
    console.error(`ERROR: Unknown legacy version: ${legacyVersion}`);
    process.exit(1);
  }

  const outputFile = options.output || 'migration-report.json';
  const outputFormat = options.format || 'json';

  console.log('============================================');
  console.log('Migration Report Generator');
  console.log('============================================\n');
  console.log(`Network: ${options.network}`);
  console.log(`Legacy Contract: ${contractAddress}.${legacyContractName}`);
  console.log(`Addresses to check: ${addresses.length}`);
  console.log(`Output: ${outputFile}\n`);
  console.log('============================================\n');

  const results = [];
  let processed = 0;

  for (const address of addresses) {
    processed++;
    process.stdout.write(`\rProcessing ${processed}/${addresses.length}...`);

    try {
      // Check staked balance
      const stakeResult = await callReadOnlyFunction({
        contractAddress,
        contractName: legacyContractName,
        functionName: 'get-stake',
        functionArgs: [standardPrincipalCV(address)],
        network,
        senderAddress: address,
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
          functionArgs: [standardPrincipalCV(address)],
          network,
          senderAddress: address,
        });

        const repValue = cvToValue(repResult);
        reputation = repValue.value || 0;
      } catch (error) {
        reputation = 0;
      }

      // Check vote locks
      let hasActiveLocks = false;
      let lockAmount = 0;
      let unlockHeight = 0;
      try {
        const lockResult = await callReadOnlyFunction({
          contractAddress,
          contractName: legacyContractName,
          functionName: 'get-vote-lock',
          functionArgs: [standardPrincipalCV(address)],
          network,
          senderAddress: address,
        });

        const lockValue = cvToValue(lockResult);
        if (lockValue.value) {
          lockAmount = lockValue.value.amount || 0;
          unlockHeight = lockValue.value.unlockHeight || 0;
          hasActiveLocks = lockAmount > 0;
        }
      } catch (error) {
        hasActiveLocks = false;
      }

      results.push({
        address,
        stakedAmount,
        stakedSTX: stakedAmount / 1000000,
        reputation,
        hasActiveLocks,
        lockAmount,
        lockAmountSTX: lockAmount / 1000000,
        unlockHeight,
        needsMigration: stakedAmount > 0 || reputation > 0,
        canMigrateNow: (stakedAmount > 0 || reputation > 0) && !hasActiveLocks,
        status: getStatus(stakedAmount, reputation, hasActiveLocks)
      });

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({
        address,
        error: error.message,
        status: 'error'
      });
    }
  }

  console.log('\n\n============================================');
  console.log('Report Summary');
  console.log('============================================\n');

  const summary = {
    totalAddresses: addresses.length,
    needsMigration: results.filter(r => r.needsMigration).length,
    canMigrateNow: results.filter(r => r.canMigrateNow).length,
    blockedByLocks: results.filter(r => r.needsMigration && !r.canMigrateNow).length,
    noAssets: results.filter(r => !r.needsMigration && !r.error).length,
    errors: results.filter(r => r.error).length,
    totalStakedSTX: results.reduce((sum, r) => sum + (r.stakedSTX || 0), 0),
    totalReputation: results.reduce((sum, r) => sum + (r.reputation || 0), 0)
  };

  console.log(`Total Addresses: ${summary.totalAddresses}`);
  console.log(`Need Migration: ${summary.needsMigration} (${(summary.needsMigration / summary.totalAddresses * 100).toFixed(1)}%)`);
  console.log(`Can Migrate Now: ${summary.canMigrateNow} (${(summary.canMigrateNow / summary.totalAddresses * 100).toFixed(1)}%)`);
  console.log(`Blocked by Locks: ${summary.blockedByLocks}`);
  console.log(`No Assets: ${summary.noAssets}`);
  console.log(`Errors: ${summary.errors}`);
  console.log(`\nTotal Staked: ${summary.totalStakedSTX.toFixed(2)} STX`);
  console.log(`Total Reputation: ${summary.totalReputation}\n`);

  // Save report
  const report = {
    generatedAt: new Date().toISOString(),
    network: options.network,
    legacyVersion,
    legacyContract: `${contractAddress}.${legacyContractName}`,
    summary,
    results
  };

  if (outputFormat === 'csv') {
    const csv = generateCSV(results);
    fs.writeFileSync(outputFile, csv);
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
  }

  console.log(`Report saved to: ${outputFile}\n`);

  // Show top users needing migration
  const topUsers = results
    .filter(r => r.needsMigration)
    .sort((a, b) => b.stakedSTX - a.stakedSTX)
    .slice(0, 10);

  if (topUsers.length > 0) {
    console.log('Top 10 Users Needing Migration:');
    console.log('--------------------------------');
    topUsers.forEach((user, i) => {
      const status = user.canMigrateNow ? '✓ Ready' : '⏳ Locked';
      console.log(`${i + 1}. ${user.address.substring(0, 10)}... - ${user.stakedSTX.toFixed(2)} STX - ${status}`);
    });
    console.log('');
  }

  console.log('============================================\n');
}

function getStatus(stakedAmount, reputation, hasActiveLocks) {
  if (stakedAmount === 0 && reputation === 0) {
    return 'no-assets';
  }
  if (hasActiveLocks) {
    return 'blocked-by-locks';
  }
  return 'ready-to-migrate';
}

function generateCSV(results) {
  const headers = [
    'Address',
    'Staked STX',
    'Reputation',
    'Has Active Locks',
    'Lock Amount STX',
    'Unlock Height',
    'Needs Migration',
    'Can Migrate Now',
    'Status'
  ];

  const rows = results.map(r => [
    r.address,
    r.stakedSTX || 0,
    r.reputation || 0,
    r.hasActiveLocks ? 'Yes' : 'No',
    r.lockAmountSTX || 0,
    r.unlockHeight || 0,
    r.needsMigration ? 'Yes' : 'No',
    r.canMigrateNow ? 'Yes' : 'No',
    r.status || 'unknown'
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

generateMigrationReport();
