# Stake Lock System

## Overview

The stake lock system provides visibility into how user funds are allocated between available and locked states. This prevents confusion when users attempt to withdraw funds that are currently locked in active votes.

## How It Works

### Stake States

1. **Total Stake**: The complete amount of STX a user has staked in the contract
2. **Locked Stake**: STX reserved as voting costs for active proposals
3. **Available Stake**: STX that can be withdrawn (Total - Locked)

### Voting Costs

SprintFund uses quadratic voting, where the cost of a vote is calculated as:

```
cost = weight²
```

For example:
- Vote weight 10 = cost 100 STX
- Vote weight 20 = cost 400 STX

These costs are locked until the voting period ends.

## Components

### StakeLockStatus

Displays the breakdown of total, locked, and available stake.

```tsx
<StakeLockStatus stakeInfo={stakeInfo} />
```

### LockedStakeBreakdown

Shows detailed information about which proposals have locked funds.

```tsx
<LockedStakeBreakdown voteCosts={voteCosts} />
```

### StakeDashboard

Comprehensive dashboard combining all stake information.

```tsx
<StakeDashboard address={userAddress} />
```

### StakeLockWarning

Inline warning component for locked funds.

```tsx
<StakeLockWarning
  lockedAmount={lockedStake}
  activeVotes={activeVotes}
  variant="warning"
/>
```

## Hooks

### useDetailedStake

Fetches comprehensive stake information including lock state.

```tsx
const { stakeInfo, loading, error } = useDetailedStake(address);
```

Returns:
- `totalStake`: Total staked amount
- `lockedStake`: Amount locked in votes
- `availableStake`: Amount available for withdrawal
- `voteCosts`: Array of vote costs per proposal
- `activeVotes`: Number of active votes
- `isLocked`: Boolean indicating if any funds are locked

## Validation

### validateWithdrawal

Validates withdrawal requests against available stake.

```tsx
const result = validateWithdrawal(amount, stakeInfo);
if (!result.canWithdraw) {
  console.error(result.error);
}
```

### getWithdrawWarning

Provides warnings for large withdrawals.

```tsx
const warning = getWithdrawWarning(amount, stakeInfo);
```

## User Experience

### Dashboard Integration

The stake dashboard is integrated into the main dashboard page, showing:
- Total stake with breakdown
- Locked funds with active vote count
- Available funds for withdrawal
- Detailed breakdown of locked funds per proposal

### Withdrawal Flow

1. User enters withdrawal amount
2. System validates against available stake
3. If funds are locked, user sees clear error message
4. Confirmation dialog shows locked amount
5. Transaction proceeds only if validation passes

### Error Messages

Clear, actionable error messages:
- "Cannot withdraw X STX. Only Y STX available."
- "Z STX is locked in N active votes."
- "Wait for voting periods to end before withdrawing."

## Technical Details

### Data Flow

1. `useDetailedStake` hook fetches:
   - Total stake from contract
   - All proposals
   - User votes on active proposals
2. Calculates locked stake from vote costs
3. Computes available stake
4. Components display the information

### Performance

- Caching at multiple levels
- Efficient proposal filtering
- Batch vote fetching
- Memoized calculations

## Future Enhancements

- Real-time updates when voting periods end
- Notifications when funds become available
- Estimated unlock times based on block height
- Historical lock state tracking
