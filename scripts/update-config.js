#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadContractConfig, getContractAddress, getContractName } from './lib/contract-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'contract-config.json');

function updateFile(filePath, replacements) {
  const fullPath = path.join(ROOT_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  File not found: ${filePath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  
  for (const [pattern, replacement] of replacements) {
    if (content.includes(pattern) && !content.includes(replacement)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`  Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

function main() {
  console.log('============================================');
  console.log('SprintFund Config Updater');
  console.log('============================================\n');
  
  const config = loadContractConfig();
  const { address, name, principal } = config.contract;
  
  console.log('Current config:');
  console.log(`  Address: ${address}`);
  console.log(`  Name: ${name}`);
  console.log(`  Principal: ${principal}\n`);
  
  const updates = [
    {
      file: 'frontend/src/config.ts',
      replacements: [
        [address, address],
        [name, name]
      ]
    },
    {
      file: 'frontend/config.ts',
      replacements: [
        [address, address],
        [name, name]
      ]
    },
    {
      file: '.env.example',
      replacements: [
        [/CONTRACT_ADDRESS=[^\n]+/, `CONTRACT_ADDRESS=${address}`],
        [/CONTRACT_NAME=[^\n]+/, `CONTRACT_NAME=${name}`]
      ]
    }
  ];
  
  let updatedCount = 0;
  
  for (const update of updates) {
    if (updateFile(update.file, update.replacements)) {
      updatedCount++;
    }
  }
  
  console.log('\n============================================');
  console.log(`Updated ${updatedCount} files`);
  console.log('Run `npm run validate-config` to verify\n');
}

main();
