# Stake Lock - Quick Reference

## Components

```tsx
// Full dashboard
<StakeDashboard address={userAddress} />

// Status only
<StakeLockStatus stakeInfo={stakeInfo} />

// Compact display
<CompactStakeStatus stakeInfo={stakeInfo} loading={loading} />

// Warning
<StakeLockWarning lockedAmount={amount} activeVotes={count} />

// Breakdown
<LockedStakeBreakdown voteCosts={voteCosts} />
```

## Hook

```tsx
const { stakeInfo, loading, error } = useDetailedStake(address);
```

## Validation

```tsx
const result = validateWithdrawal(amount, stakeInfo);
if (!result.canWithdraw) {
  console.error(result.error);
}
```

## Messages

```tsx
getStakeLockMessage(stakeInfo);
getWithdrawalBlockedMessage(stakeInfo);
getStakeStatusSummary(stakeInfo);
getVoteCostExplanation(weight);
```

## Unlock Calculator

```tsx
const estimates = calculateUnlockEstimates(voteCosts, proposals, blockHeight);
const formatted = formatUnlockTime(estimates[0]);
const total = getTotalUnlockingAmount(estimates);
const next = getNextUnlockEstimate(estimates);
```

## Types

```tsx
interface DetailedStakeInfo {
  totalStake: number;
  lockedStake: number;
  availableStake: number;
  isLocked: boolean;
  voteCosts: VoteCostInfo[];
  activeVotes: number;
}
```
