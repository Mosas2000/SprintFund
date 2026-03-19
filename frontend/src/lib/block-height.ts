import { formatTimeAgo } from './notification-time';

const STACKS_BLOCK_TIME_MS = 10 * 60 * 1000;
const NETWORK_LAUNCH_TIME = new Date('2021-01-14T00:00:00Z').getTime();
const NETWORK_LAUNCH_BLOCK = 0;

function estimateTimestampFromBlockHeight(blockHeight: number): number {
  const blocksSinceGenesis = Math.max(0, blockHeight - NETWORK_LAUNCH_BLOCK);
  return NETWORK_LAUNCH_TIME + blocksSinceGenesis * STACKS_BLOCK_TIME_MS;
}

export function formatBlockHeight(blockHeight: number | null | undefined): string {
  if (blockHeight === null || blockHeight === undefined || isNaN(blockHeight) || blockHeight < 0) {
    return 'Block #0';
  }

  const blockNum = Math.floor(blockHeight);
  const estimatedTimestamp = estimateTimestampFromBlockHeight(blockNum);
  const relativeTime = formatTimeAgo(estimatedTimestamp);

  return `Block #${blockNum.toLocaleString()} (${relativeTime})`;
}

export function formatBlockHeightShort(blockHeight: number | null | undefined): string {
  if (blockHeight === null || blockHeight === undefined || isNaN(blockHeight) || blockHeight < 0) {
    return 'Block #0';
  }

  return `Block #${Math.floor(blockHeight).toLocaleString()}`;
}

export function getBlockTimestampEstimate(blockHeight: number | null | undefined): number | null {
  if (blockHeight === null || blockHeight === undefined || isNaN(blockHeight) || blockHeight < 0) {
    return null;
  }

  return estimateTimestampFromBlockHeight(blockHeight);
}
