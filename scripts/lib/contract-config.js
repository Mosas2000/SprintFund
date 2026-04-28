import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, '../../contract-config.json');

let cachedConfig = null;

export function loadContractConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    cachedConfig = JSON.parse(configData);
    return cachedConfig;
  } catch (error) {
    console.error('Failed to load contract-config.json:', error.message);
    process.exit(1);
  }
}

export function getContractAddress() {
  const config = loadContractConfig();
  return config.contract.address;
}

export function getContractName() {
  const config = loadContractConfig();
  return config.contract.name;
}

export function getContractPrincipal() {
  const config = loadContractConfig();
  return config.contract.principal;
}

export function getNetworkConfig(networkName = 'mainnet') {
  const config = loadContractConfig();
  return config.network[networkName] || config.network.mainnet;
}

export function getContractVersion() {
  const config = loadContractConfig();
  return config.version;
}
