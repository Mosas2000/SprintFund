# Stake Lock Visibility Migration Guide

## Overview

This guide helps developers integrate the new stake lock visibility system into their components.

## For Component Developers

### Using the Stake Dashboard

```tsx
import { StakeDashboard } from '@/components/stake';

function MyPage() {
  const address = useWalletAddress();
  return <StakeDashboard address={address} />;
}
```

### Using Detailed Stake Hook

```tsx
import { useDetailedStake } from '@/hooks';

function MyComponent() {
  const address = useWalletAddress();
  const { stakeInfo, loading, error } = useDetailedStake(address);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Total: {stakeInfo.totalStake}</p>
      <p>Locked: {stakeInfo.lockedStake}</p>
      <p>Available: {stakeInfo.availableStake}</p>
    </div>
  );
}
```

### Validating Withdrawals

```tsx
import { validateWithdrawal } from '@/lib/stake';

function handleWithdraw(amount: number) {
  const result = validateWithdrawal(amount, stakeInfo);
  
  if (!result.canWithdraw) {
    showError(result.error);
    if (result.warning) {
      showWarning(result.warning);
    }
    return;
  }
  
  // Proceed with withdrawal
}
```

## Breaking Changes

None. This is a new feature that doesn't affect existing functionality.

## New Components

- `StakeDashboard` - Main dashboard
- `StakeLockStatus` - Status display
- `LockedStakeBreakdown` - Detailed breakdown
- `StakeLockWarning` - Inline warning
- `CompactStakeStatus` - Compact display

## New Hooks

- `useDetailedStake` - Fetch detailed stake info

## New Utilities

- `validateWithdrawal` - Validate withdrawal requests
- `getWithdrawWarning` - Get withdrawal warnings
- `getStakeLockMessage` - Format lock messages
- `calculateUnlockEstimates` - Calculate unlock times

## Testing

All new utilities include comprehensive test coverage. Run tests with:

```bash
npm test stake
```

## Documentation

See `frontend/docs/STAKE_LOCK_SYSTEM.md` for complete documentation.
