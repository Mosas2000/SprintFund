#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'contract-config.json');

function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('ERROR: Failed to load contract-config.json');
    console.error(error.message);
    process.exit(1);
  }
}

function checkFile(filePath, patterns, config) {
  const fullPath = path.join(ROOT_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { file: filePath, status: 'missing', issues: [] };
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const issues = [];
  
  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex, 'g');
    const matches = content.match(regex) || [];
    
    for (const match of matches) {
      if (!match.includes(pattern.expected)) {
        issues.push({
          pattern: pattern.regex,
          found: match,
          expected: pattern.expected
        });
      }
    }
  }
  
  return {
    file: filePath,
    status: issues.length === 0 ? 'ok' : 'mismatch',
    issues
  };
}

function main() {
  console.log('============================================');
  console.log('SprintFund Config Validation');
  console.log('============================================\n');
  
  const config = loadConfig();
  const { address, name, principal } = config.contract;
  
  console.log('Centralized config:');
  console.log(`  Address: ${address}`);
  console.log(`  Name: ${name}`);
  console.log(`  Principal: ${principal}\n`);
  
  const checks = [
    {
      file: 'frontend/src/config.ts',
      patterns: [
        { regex: "CONTRACT_ADDRESS\\s*=\\s*['\"][^'\"]+['\"]", expected: address },
        { regex: "CONTRACT_NAME\\s*=\\s*['\"][^'\"]+['\"]", expected: name }
      ]
    },
    {
      file: 'frontend/config.ts',
      patterns: [
        { regex: "CONTRACT_ADDRESS\\s*=\\s*['\"][^'\"]+['\"]", expected: address },
        { regex: "CONTRACT_NAME\\s*=\\s*['\"][^'\"]+['\"]", expected: name }
      ]
    },
    {
      file: '.env.example',
      patterns: [
        { regex: "CONTRACT_ADDRESS=[^\\s]+", expected: address },
        { regex: "CONTRACT_NAME=[^\\s]+", expected: name }
      ]
    },
    {
      file: 'README.md',
      patterns: [
        { regex: "SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T\\.sprintfund-core-v3", expected: principal }
      ]
    }
  ];
  
  let hasErrors = false;
  
  for (const check of checks) {
    const result = checkFile(check.file, check.patterns, config);
    
    if (result.status === 'missing') {
      console.log(`MISSING: ${result.file}`);
      hasErrors = true;
    } else if (result.status === 'ok') {
      console.log(`OK: ${result.file}`);
    } else {
      console.log(`MISMATCH: ${result.file}`);
      for (const issue of result.issues) {
        console.log(`  Found: ${issue.found}`);
        console.log(`  Expected to contain: ${issue.expected}`);
      }
      hasErrors = true;
    }
  }
  
  console.log('\n============================================');
  
  if (hasErrors) {
    console.log('VALIDATION FAILED');
    console.log('Some files have config mismatches.');
    console.log('============================================\n');
    process.exit(1);
  } else {
    console.log('VALIDATION PASSED');
    console.log('All config files are in sync.');
    console.log('============================================\n');
    process.exit(0);
  }
}

main();
