# Loading States - Integration Guide

## Overview

The loading states system provides consistent patterns for managing async operations throughout the SprintFund application. This guide covers integration patterns and best practices.

## Quick Start

### 1. Transaction-Based Operations

For blockchain transactions (staking, voting, proposal execution):

```typescript
import { useTransaction } from '@/hooks';
import { LoadingButton } from '@/components/LoadingIndicators';

export function VoteProposal() {
  const { isLoading, execute } = useTransaction({
    onSuccess: (txId) => {
      toast.success(`Vote submitted: ${txId}`);
      // Refresh proposals after voting
      refreshProposals();
    },
    onError: (err) => {
      toast.error(`Vote failed: ${err.message}`);
    },
  });

  const handleVote = async () => {
    await execute(async () => {
      return new Promise<string>((resolve, reject) => {
        openContractCall({
          // configuration...
          onFinish: (data) => resolve(data.txId),
          onCancel: () => reject(new Error('User cancelled')),
        }).catch(reject);
      });
    });
  };

  return (
    <LoadingButton isLoading={isLoading} onClick={handleVote}>
      Cast Vote
    </LoadingButton>
  );
}
```

### 2. Data Fetching

For loading data from API or contract read-only functions:

```typescript
import { useRefresh } from '@/hooks';
import { ProposalCardSkeleton } from '@/components/SkeletonLoaders';

export function ProposalsList() {
  const { isLoading, data: proposals, error, refresh } = useRefresh(
    async () => {
      // Fetch proposals from contract
      return fetchProposals();
    },
    {
      onSuccess: (data) => {
        console.log(`Loaded ${data.length} proposals`);
      },
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ProposalCardSkeleton />
        <ProposalCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        {error.message}
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {proposals.map(p => <ProposalCard key={p.id} proposal={p} />)}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

### 3. Form Submissions

For form-based operations:

```typescript
import { useFormSubmit } from '@/hooks';
import { LoadingButton } from '@/components/LoadingIndicators';

export function CreateProposal() {
  const [formData, setFormData] = useState({});
  const { isLoading, error, submit, reset } = useFormSubmit(
    async () => {
      return submitProposal(formData);
    },
    {
      onSuccess: (result) => {
        toast.success('Proposal created!');
        reset();
      },
    }
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await submit();
      }}
    >
      {error && <div className="text-red-500">{error.message}</div>}
      <input
        type="text"
        disabled={isLoading}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <LoadingButton isLoading={isLoading}>Create</LoadingButton>
    </form>
  );
}
```

### 4. Polling Updates

For continuous data updates:

```typescript
import { usePoll } from '@/hooks';

export function LiveProposalStats() {
  const { isPolling, data: stats, startPolling, stopPolling } = usePoll(
    async () => {
      return fetchProposalStats();
    },
    5000, // Poll every 5 seconds
    {
      onSuccess: (data) => {
        console.log('Stats updated');
      },
    }
  );

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);

  return <div>{stats?.totalProposals}</div>;
}
```

## Advanced Patterns

### Multi-Step Operations

For operations with multiple stages:

```typescript
import { useMultiStep } from '@/hooks';

export function ComplexProposal() {
  const { steps, executeStep, allComplete } = useMultiStep([
    { id: 'validate', name: 'Validate Input' },
    { id: 'stake', name: 'Stake Collateral' },
    { id: 'submit', name: 'Submit Proposal' },
    { id: 'confirm', name: 'Confirm' },
  ]);

  const execute = async () => {
    await executeStep('validate', async () => {
      validateForm(formData);
    });

    await executeStep('stake', async () => {
      await stakeCollateral();
    });

    await executeStep('submit', async () => {
      await submitProposal();
    });

    await executeStep('confirm', async () => {
      await confirmSubmission();
    });
  };

  return (
    <div>
      {steps.map(step => (
        <div key={step.id} className={`step-${step.status}`}>
          {step.name}
        </div>
      ))}
      <button onClick={execute} disabled={allComplete()}>
        Execute
      </button>
    </div>
  );
}
```

### Retry Logic

For operations that might fail temporarily:

```typescript
import { useRetry } from '@/hooks';

export function FetchWithRetry() {
  const { isLoading, attempts, execute } = useRetry(
    async () => {
      return fetchUnstableAPI();
    },
    {
      maxAttempts: 3,
      delayMs: 1000,
      backoffMultiplier: 2,
      onRetry: (attempt) => {
        console.log(`Retry attempt ${attempt}`);
      },
    }
  );

  return (
    <div>
      <button onClick={execute} disabled={isLoading}>
        {isLoading ? `Attempt ${attempts}` : 'Fetch Data'}
      </button>
    </div>
  );
}
```

### Debounced Search

For search input with automatic debouncing:

```typescript
import { useDebouncedSearch } from '@/hooks';

export function ProposalSearch() {
  const { isLoading, query, setQuery, results } = useDebouncedSearch(
    async (q) => {
      return searchProposals(q);
    },
    { delay: 300, minChars: 2 }
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search proposals..."
      />
      {isLoading && <LoadingSpinner />}
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

## Integration Checklist

- [ ] Replace manual `isLoading` states with appropriate hook
- [ ] Add error handling and display error messages
- [ ] Show loading skeletons or spinners during data fetch
- [ ] Disable form inputs during submission
- [ ] Display success/error toast notifications
- [ ] Add retry buttons for failed operations
- [ ] Test loading states with slow network (DevTools)
- [ ] Handle edge cases (rapid clicks, abort, cleanup)

## Common Mistakes

### ❌ Don't: Manual loading state

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const submit = async () => {
  setIsLoading(true);
  try {
    await api.submit();
    setIsLoading(false);
  } catch (e) {
    setError(e);
    setIsLoading(false);
  }
};
```

### ✅ Do: Use loading hook

```typescript
const { isLoading, error, submit } = useFormSubmit(() => api.submit());
```

### ❌ Don't: Show nothing while loading

```typescript
if (isLoading) return null;
```

### ✅ Do: Show skeleton or spinner

```typescript
if (isLoading) return <SkeletonLoader />;
```

### ❌ Don't: Ignore errors

```typescript
const { data } = useFetch(fetchData);
```

### ✅ Do: Handle and display errors

```typescript
const { data, error } = useFetch(fetchData);
if (error) return <ErrorMessage error={error} />;
```

## Testing Loading States

### Manual Testing

1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Slow 3G" or "Offline" to simulate slow network
4. Trigger async operations and verify loading states

### Automated Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTransaction } from '@/hooks';

test('shows loading state during transaction', async () => {
  const { result } = renderHook(() => useTransaction());

  act(() => {
    expect(result.current.isLoading).toBe(false);
  });

  act(() => {
    result.current.execute(async () => 'txId');
  });

  expect(result.current.isLoading).toBe(true);
});
```

## Troubleshooting

### Loading state persists

- Check if `.catch()` is properly rejecting errors
- Ensure error callback isn't suppressing the error
- Verify cleanup function is running

### Multiple loading states clash

- Use separate hooks for separate operations
- Use `useMultiAsync` for named operations
- Or use context for app-wide loading state

### Performance issues with polling

- Reduce polling frequency
- Use `useRefresh` with manual refresh button instead
- Cancel polling when component unmounts

## References

- [Loading States Documentation](./LOADING_STATES.md)
- [Hooks API](./src/hooks/)
- [UI Components](./src/components/)
