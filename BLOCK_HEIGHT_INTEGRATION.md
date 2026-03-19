Block Height Utilities Integration Guide

This guide explains how to integrate block height utilities into your components
and pages throughout the SprintFund application.

Quick Start
===========

1. Display Block Height (Simplest)
   import { formatBlockHeight } from '../lib/block-height';

   <p>{formatBlockHeight(proposal.createdAt)}</p>

2. Use Hook (Recommended for Components)
   import { useBlockHeight } from '../hooks/useBlockHeight';

   const { displayedTime, estimatedTimestamp } = useBlockHeight(blockHeight);
   <p>{displayedTime}</p>

3. Use Component (Recommended for Display)
   import { BlockHeightDisplay } from '../components/BlockHeightDisplay';

   <BlockHeightDisplay blockHeight={proposal.createdAt} format="full" />

Integration Patterns
====================

Pattern 1: Simple List Display
  function ProposalList({ proposals }) {
    return (
      <ul>
        {proposals.map((p) => (
          <li key={p.id}>
            <h3>{p.title}</h3>
            <p>Created: {formatBlockHeight(p.createdAt)}</p>
          </li>
        ))}
      </ul>
    );
  }

Pattern 2: Component with Tooltip
  function ProposalCard({ proposal }) {
    const blockInfo = useBlockHeight(proposal.createdAt);
    return (
      <div>
        <h1>{proposal.title}</h1>
        <div title={blockInfo.displayedTime}>
          {blockInfo.formattedShort}
        </div>
      </div>
    );
  }

Pattern 3: Complex Display with Calculations
  function ProposalAnalytics({ proposal }) {
    const blockInfo = useBlockHeight(proposal.createdAt);
    const daysOld = getBlockHeightDaysOld(proposal.createdAt);
    const isRecent = isBlockHeightRecent(proposal.createdAt);

    return (
      <div>
        <p>Age: {daysOld} days</p>
        <p>Status: {isRecent ? 'Recent' : 'Archived'}</p>
        <time dateTime={new Date(blockInfo.estimatedTimestamp).toISOString()}>
          {blockInfo.displayedTime}
        </time>
      </div>
    );
  }

Pattern 4: Sorting and Filtering by Block Height
  function SortedProposals({ proposals }) {
    const sorted = sortBlockHeightsByNewest(
      proposals.map((p) => p.createdAt),
    );

    const filtered = proposals.filter((p) =>
      isBlockHeightRecent(p.createdAt, 7 * 24 * 60 * 60 * 1000),
    );

    return (
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>{formatBlockHeight(p.createdAt)}</li>
        ))}
      </ul>
    );
  }

Choosing the Right Function
============================

Use formatBlockHeight() when:
  ✓ You need simple one-time display
  ✓ Block height is at top level of component
  ✓ No performance concerns

Use useBlockHeight() when:
  ✓ Component is re-rendered frequently
  ✓ You need multiple formats of same value
  ✓ You need to calculate estimated timestamp
  ✓ Using same block height in multiple places

Use BlockHeightDisplay when:
  ✓ You want consistent styling across app
  ✓ You need format toggle (full/short)
  ✓ You want tooltip support
  ✓ You're building UI-heavy component

Use validation functions when:
  ✓ Working with user input
  ✓ API responses need validation
  ✓ You're in critical calculation path
  ✓ You need type safety

Common Use Cases
================

Use Case 1: Proposal List View
  import { BlockHeightDisplay } from '../components/BlockHeightDisplay';

  export function ProposalList({ proposals }) {
    return (
      <table>
        <tbody>
          {proposals.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>
                <BlockHeightDisplay
                  blockHeight={p.createdAt}
                  format="short"
                  className="text-muted"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

Use Case 2: Proposal Details Page
  import { formatBlockHeight } from '../lib/block-height';

  export function ProposalDetails({ proposal }) {
    return (
      <aside>
        <div>
          <label>Created at Block</label>
          <p>{formatBlockHeight(proposal.createdAt)}</p>
        </div>
      </aside>
    );
  }

Use Case 3: Timeline View
  import { getBlockHeightDaysOld } from '../lib/block-height-utils';

  export function Timeline({ events }) {
    const sortedEvents = [...events].sort(
      (a, b) => b.blockHeight - a.blockHeight,
    );

    return (
      <ul>
        {sortedEvents.map((event) => (
          <li key={event.id}>
            <span>{getBlockHeightDaysOld(event.blockHeight)} days ago</span>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    );
  }

Use Case 4: Search and Filter
  import { isBlockHeightRecent } from '../lib/block-height-utils';

  export function FilterProposals({ proposals, filter }) {
    const filtered = proposals.filter((p) => {
      if (filter === 'recent') {
        return isBlockHeightRecent(
          p.createdAt,
          30 * 24 * 60 * 60 * 1000,
        );
      }
      return true;
    });

    return (
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>{formatBlockHeight(p.createdAt)}</li>
        ))}
      </ul>
    );
  }

Performance Optimization Tips
==============================

Tip 1: Memoize Block Height Formatting in Lists
  Bad:
    function ProposalList({ proposals }) {
      return proposals.map((p) => (
        <li>{formatBlockHeight(p.createdAt)}</li>
      ));
    }

  Good:
    function ProposalListItem({ proposal }) {
      const blockInfo = useBlockHeight(proposal.createdAt);
      return <li>{blockInfo.displayedTime}</li>;
    }

Tip 2: Use BlockHeightDisplay for Complex UI
  Bad:
    function Card({ proposal }) {
      return (
        <div>
          <span>{formatBlockHeight(proposal.createdAt).split(' ')[0]}</span>
        </div>
      );
    }

  Good:
    function Card({ proposal }) {
      return (
        <div>
          <BlockHeightDisplay
            blockHeight={proposal.createdAt}
            format="short"
          />
        </div>
      );
    }

Tip 3: Validate Input at Boundaries
  import { validateBlockHeight } from '../lib/block-height-utils';

  function handleProposalData(data) {
    const blockHeight = validateBlockHeight(data.created_at, 'created_at');
    return { ...data, createdAt: blockHeight };
  }

Tip 4: Cache Sorted Results
  Bad:
    function ProposalList({ proposals }) {
      const sorted = sortBlockHeightsByNewest(
        proposals.map((p) => p.createdAt),
      );
      // Re-sorts on every render
    }

  Good:
    function ProposalList({ proposals }) {
      const sorted = useMemo(() =>
        sortBlockHeightsByNewest(
          proposals.map((p) => p.createdAt),
        ),
        [proposals],
      );
    }

Migration Checklist
===================

For Each Component Using Block Heights:
[ ] Locate .toLocaleString() calls on block heights
[ ] Choose appropriate formatting function
[ ] Test with null/undefined values
[ ] Verify display is human-readable
[ ] Add tests for block height formatting
[ ] Update documentation/comments
[ ] Review with team
[ ] Deploy and monitor

TypeScript Tips
===============

Type Safety with Block Heights
  import { isValidBlockHeight } from '../lib/block-height-utils';

  function processBlockHeight(value: unknown): number {
    if (!isValidBlockHeight(value)) {
      throw new Error('Invalid block height');
    }
    return value; // Now TypeScript knows it's a number
  }

Assertion Function
  import { assertBlockHeight } from '../lib/block-height-utils';

  function useProposal(data: any) {
    assertBlockHeight(data.createdAt);
    // TypeScript knows data.createdAt is a number now
    return formatBlockHeight(data.createdAt);
  }

Testing Block Heights in Your Components
=========================================

Unit Test Example
  import { render, screen } from '@testing-library/react';
  import ProposalCard from './ProposalCard';

  test('displays formatted block height', () => {
    const proposal = {
      id: 1,
      title: 'Test',
      createdAt: 12345,
      // ... other fields
    };

    render(<ProposalCard proposal={proposal} />);
    const element = screen.getByText(/Block #12,345/);
    expect(element).toBeInTheDocument();
  });

Testing Edge Cases
  test('handles null block height', () => {
    const proposal = { ...mockProposal, createdAt: null };
    render(<ProposalCard proposal={proposal} />);
    const element = screen.getByText('Block #0');
    expect(element).toBeInTheDocument();
  });

Debugging Block Heights
========================

Enable console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Block height:', blockHeight);
    console.log('Formatted:', formatBlockHeight(blockHeight));
    console.log('Timestamp:', getBlockTimestampEstimate(blockHeight));
  }

Create debug component
  export function BlockHeightDebug({ blockHeight }) {
    const info = useBlockHeight(blockHeight);
    return (
      <div style={{ border: '1px solid red', padding: '10px' }}>
        <p>Block Height: {blockHeight}</p>
        <p>Full Format: {info.formattedFull}</p>
        <p>Short Format: {info.formattedShort}</p>
        <p>Timestamp: {info.estimatedTimestamp}</p>
      </div>
    );
  }

Troubleshooting
================

Q: Getting "NaN" display?
A: Check if block height is actually a number. Use isValidBlockHeight() to verify.

Q: Timestamp seems wrong?
A: Remember estimates assume 10min blocks. Check with actual blockchain time.

Q: Performance issue?
A: Use useBlockHeight hook and memoize components. Avoid re-calculating in loops.

Q: Tests failing?
A: Ensure test data has valid block heights. Use 0 for genesis block tests.

Resources
==========
- BLOCK_HEIGHT_GUIDE.md - User and developer guide
- BLOCK_HEIGHT_API.md - Complete API reference
- BLOCK_HEIGHT_CHANGELOG.md - Change log
- ISSUE_115_SUMMARY.md - Issue summary and resolution
