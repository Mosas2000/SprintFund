Block Height Display Guide

Overview
--------
This guide explains how to work with Stacks block heights in the SprintFund application.
Block heights are stored as numbers in proposal data and must be formatted for user display.

Understanding Block Heights
---------------------------
- Block Height: A sequential number representing position in the Stacks blockchain
- Stacks Network Launch: January 14, 2021
- Average Block Time: ~10 minutes per block
- Proposal.createdAt: Stores block height, not Unix timestamp

DO NOT use .toLocaleString() on block heights - they will display as plain numbers!

Using the Block Height Formatter
---------------------------------

1. In Components
   Import the formatBlockHeight function:

   import { formatBlockHeight } from '../lib/block-height';

   // Display block with relative time
   <p>{formatBlockHeight(proposal.createdAt)}</p>
   // Output: "Block #12,345 (Apr 9)"

2. For Short Display
   Use formatBlockHeightShort() for compact display:

   import { formatBlockHeightShort } from '../lib/block-height';

   <span>{formatBlockHeightShort(proposal.createdAt)}</span>
   // Output: "Block #12,345"

3. In Hooks
   Use the useBlockHeight hook for better performance:

   import { useBlockHeight } from '../hooks/useBlockHeight';

   const blockInfo = useBlockHeight(proposal.createdAt);
   <p>{blockInfo.displayedTime}</p> // Memoized result

4. For Calculations
   Get estimated Unix timestamp:

   import { getBlockTimestampEstimate } from '../lib/block-height';

   const timestamp = getBlockTimestampEstimate(proposal.createdAt);
   if (timestamp) {
     const date = new Date(timestamp);
     // Use for calculations or comparisons
   }

Edge Cases Handled
------------------
✓ null or undefined block heights → "Block #0"
✓ NaN values → "Block #0"
✓ Negative numbers → "Block #0"
✓ Very large numbers → Formatted with thousands separators
✓ Block 0 (Genesis) → "Block #0 (just now)" or similar

Stacks Network Timeline
-----------------------
The estimations are based on:
- Network Genesis: 2021-01-14 00:00:00 UTC
- Average Block Time: 10 minutes (600 seconds)
- Block Height 0: Network launch time

Examples
--------

Block Height 1000:
  Full Format: "Block #1,000 (Jan 21)"
  Short Format: "Block #1,000"
  Estimated Time: ~7 days after genesis

Block Height 52,560:
  Full Format: "Block #52,560 (Jan 28)"
  Short Format: "Block #52,560"
  Estimated Time: ~365 days after genesis (approximately 1 year)

Block Height 525,600:
  Full Format: "Block #525,600 (Jan 19)"
  Short Format: "Block #525,600"
  Estimated Time: ~3650 days after genesis (approximately 10 years)

Testing
-------
The block-height utilities include comprehensive test coverage:
- Positive numbers with thousands formatting
- Null and undefined inputs
- NaN and negative values
- Large number handling
- Timestamp estimation

Run tests:
  npm run test:frontend -- src/lib/block-height.test.ts

Migration Guide
---------------
If you find code using .toLocaleString() on proposal.createdAt:

BEFORE (INCORRECT):
  <p>{proposal.createdAt.toLocaleString()}</p>

AFTER (CORRECT):
  import { formatBlockHeight } from '../lib/block-height';
  <p>{formatBlockHeight(proposal.createdAt)}</p>

Common Issues
-------------
Q: Why does my block height show a date like "Apr 9" instead of "X ago"?
A: Blocks older than one week display as dates by design. This is correct behavior
   from formatTimeAgo(). See notification-time.ts for details.

Q: How accurate is the timestamp estimation?
A: Estimates assume consistent 10-minute blocks. Actual times may vary due to
   network conditions. Use only for display purposes, not critical calculations.

Q: Can I sort proposals by block height?
A: Yes! Block heights are numbers, so normal numeric comparison works:
   proposals.sort((a, b) => a.createdAt - b.createdAt);

Architecture Notes
------------------
- formatBlockHeight: Full display with estimated relative time
- formatBlockHeightShort: Compact format, just the block number
- getBlockTimestampEstimate: Internal calculation for timestamp
- useBlockHeight hook: Performance-optimized for React components
- useProposalBlockHeight: Specialized hook for proposals
