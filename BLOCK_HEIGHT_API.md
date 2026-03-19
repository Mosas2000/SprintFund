Block Height API Reference

lib/block-height.ts
===================

Constants
---------
STACKS_BLOCK_TIME_MS = 10 * 60 * 1000 (600000ms)
  Average time between Stacks blocks in milliseconds.

NETWORK_LAUNCH_TIME = Date('2021-01-14T00:00:00Z').getTime()
  Unix timestamp of Stacks network genesis.

NETWORK_LAUNCH_BLOCK = 0
  Block height of network genesis.


Functions
---------

formatBlockHeight(blockHeight: number | null | undefined): string
Description:
  Returns a formatted block height with estimated relative time.

Parameters:
  - blockHeight: A Stacks block height number

Returns:
  - String in format "Block #<number> (<relative_time>)"
  - Example output: "Block #12,345 (Apr 9)"

Edge Cases:
  - null/undefined: Returns "Block #0"
  - NaN: Returns "Block #0"
  - Negative: Returns "Block #0"
  - Very old blocks: Shows date instead of "X ago"


formatBlockHeightShort(blockHeight: number | null | undefined): string
Description:
  Returns a compact block height display without relative time.

Parameters:
  - blockHeight: A Stacks block height number

Returns:
  - String in format "Block #<number>"
  - Example output: "Block #12,345"

Edge Cases:
  - Handles null, undefined, NaN, negative consistently
  - Large numbers formatted with thousands separators


getBlockTimestampEstimate(blockHeight: number | null | undefined): number | null
Description:
  Calculates estimated Unix timestamp for a given block height.

Parameters:
  - blockHeight: A Stacks block height number

Returns:
  - Unix timestamp (milliseconds) or null if invalid
  - Estimated as: NETWORK_LAUNCH_TIME + (blockHeight * STACKS_BLOCK_TIME_MS)

Edge Cases:
  - Returns null for null, undefined, NaN, or negative inputs
  - Use for internal calculations only, not critical operations


hooks/useBlockHeight.ts
=======================

useBlockHeight(blockHeight: number | null | undefined): UseBlockHeightResult
Description:
  React hook for formatted block height with memoization.

Parameters:
  - blockHeight: A Stacks block height number

Returns:
  - UseBlockHeightResult object:
    {
      formattedFull: string;      // Full format with time
      formattedShort: string;     // Compact format
      estimatedTimestamp: number | null;  // Unix timestamp
      displayedTime: string;      // Same as formattedFull
    }

Benefits:
  - Memoized results prevent unnecessary recalculations
  - Safe for use in component render paths
  - Optimized for React performance


useProposalBlockHeight(proposal: Proposal | null): UseBlockHeightResult
Description:
  Specialized hook that extracts and formats proposal.createdAt.

Parameters:
  - proposal: A Proposal object or null

Returns:
  - UseBlockHeightResult object (same as useBlockHeight)

Usage:
  const blockInfo = useProposalBlockHeight(proposal);


Usage Examples
==============

Example 1: Simple Display
  import { formatBlockHeight } from '../lib/block-height';

  export function ProposalMeta({ proposal }: Props) {
    return (
      <div>
        <p>Created: {formatBlockHeight(proposal.createdAt)}</p>
      </div>
    );
  }


Example 2: Using Hook
  import { useBlockHeight } from '../hooks/useBlockHeight';

  export function BlockInfo({ blockHeight }: Props) {
    const { formattedFull, estimatedTimestamp } = useBlockHeight(blockHeight);

    return (
      <div>
        <span>{formattedFull}</span>
        {estimatedTimestamp && (
          <time dateTime={new Date(estimatedTimestamp).toISOString()} />
        )}
      </div>
    );
  }


Example 3: Conditional Rendering
  import { formatBlockHeightShort } from '../lib/block-height';

  export function BlockBadge({ blockHeight }: Props) {
    return (
      <span className="badge" title={formatBlockHeight(blockHeight)}>
        {formatBlockHeightShort(blockHeight)}
      </span>
    );
  }


Example 4: Timestamp Calculations
  import { getBlockTimestampEstimate } from '../lib/block-height';

  export function getProposalAge(createdAt: number): string {
    const timestamp = getBlockTimestampEstimate(createdAt);
    if (!timestamp) return 'Unknown';

    const ageMs = Date.now() - timestamp;
    const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
    return `${ageDays} days old`;
  }


Type Definitions
================

UseBlockHeightResult
{
  formattedFull: string;      // "Block #12,345 (Apr 9)"
  formattedShort: string;     // "Block #12,345"
  estimatedTimestamp: number | null;  // Unix timestamp or null
  displayedTime: string;      // Full format (same as formattedFull)
}


Testing
=======

Test Location:
  frontend/src/lib/block-height.test.ts

Test Coverage:
  - formatBlockHeightShort: 7 tests
  - formatBlockHeight: 5 tests
  - getBlockTimestampEstimate: 3 tests

Total: 16 passing tests

Run Tests:
  npm run test:frontend -- src/lib/block-height.test.ts


Integration Checklist
====================

[ ] Import correct formatter function
[ ] Avoid using .toLocaleString() on block heights
[ ] Use hook for component performance optimization
[ ] Handle null/undefined inputs
[ ] Test with edge cases
[ ] Update related documentation
[ ] Run full test suite
