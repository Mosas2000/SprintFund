# Loading States System

Complete loading state management system for SprintFund application with consistent patterns across async operations.

## Core Concepts

### LoadingState Type

Base type for all loading state management:

```typescript
type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface LoadingState {
  status: AsyncStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  progress?: number;
}
```

## Utilities

### lib/loading-state.ts

Core utilities for managing loading states:

```typescript
// Create initial loading state
const state = createLoadingState('idle');

// Update loading state
const updated = updateLoadingState(state, 'loading');

// Check if any operation is loading
const anyLoading = isAnyLoading([state1, state2]);

// Check if has error
const hasError = hasError(state);
```

## Hooks

### useTransaction

For contract transactions with loading state:

```typescript
const { isLoading, execute } = useTransaction({
  onSuccess: (txId) => console.log('Transaction:', txId),
  onError: (err) => console.error('Failed:', err),
});

await execute(async () => {
  return new Promise<string>((resolve, reject) => {
    openContractCall({
      // options...
      onFinish: (data) => resolve(data.txId),
      onCancel: () => reject(new Error('Cancelled')),
    }).catch(reject);
  });
});
```

### useRefresh / usePoll

For data fetching and polling:

```typescript
// One-time refresh
const { isLoading, data, refresh } = useRefresh(async () => {
  return fetchProposals();
}, {
  onSuccess: (data) => console.log('Loaded:', data),
  onError: (err) => console.error('Failed:', err),
});

// Periodic polling
const { isPolling, startPolling, stopPolling } = usePoll(
  async () => fetchProposals(),
  30000, // 30 second interval
  { onSuccess: (data) => console.log('Polled:', data) }
);

startPolling();
stopPolling();
```

### useFetch

Generic fetch hook for data loading:

```typescript
const { isLoading, data, error, fetch } = useFetch(
  async () => {
    return fetchData();
  },
  {
    onSuccess: (data) => console.log('Data:', data),
    onError: (err) => console.error('Error:', err),
  }
);

const result = await fetch();
```

### useFormSubmit

For form submission with state management:

```typescript
const { isLoading, error, submit, reset } = useFormSubmit(
  async () => {
    return submitForm(formData);
  },
  {
    onSuccess: (result) => console.log('Submitted:', result),
    onError: (err) => console.error('Error:', err),
  }
);

await submit();
reset();
```

### useAsync / useMultiAsync

General async operation management:

```typescript
// Single operation
const { isLoading, data, error } = useAsync(async () => {
  return fetchData();
}, { onSuccess: (data) => console.log(data) });

// Multiple named operations
const { isLoading, startAsync, data } = useMultiAsync({
  fetch1: async () => fetch('/api/1'),
  fetch2: async () => fetch('/api/2'),
});

await startAsync('fetch1');
```

### useMultiStep

Track multi-step operations:

```typescript
const { steps, executeStep, allComplete, reset } = useMultiStep([
  { id: 'step1', name: 'Initialize' },
  { id: 'step2', name: 'Validate' },
  { id: 'step3', name: 'Execute' },
]);

await executeStep('step1', async () => {
  // Step 1 logic
});
```

### useRetry

Automatic retry with exponential backoff:

```typescript
const { isLoading, attempts, execute } = useRetry(
  async () => {
    return fetchDataWithRetry();
  },
  {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    onRetry: (attempt) => console.log(`Retry ${attempt}`),
  }
);

await execute();
```

### useGlobalLoading

Global loading state management:

```typescript
// Wrap app with provider
<GlobalLoadingProvider>
  <App />
</GlobalLoadingProvider>

// Use in components
const { globalLoading, startLoading, completeLoading } = useGlobalLoading();

startLoading('Processing...');
completeLoading();
```

## UI Components

### LoadingSpinner

Animated spinner with size variants:

```typescript
<LoadingSpinner size="lg" />
<LoadingSpinner size="md" />
<LoadingSpinner size="sm" />
```

### LoadingOverlay

Loading overlay with optional message:

```typescript
<LoadingOverlay isVisible={isLoading} message="Loading..." />
<LoadingOverlay isVisible={isLoading} fullScreen={true} />
```

### LoadingButton

Button with loading state:

```typescript
<LoadingButton isLoading={isLoading} loadingText="Submitting...">
  Submit
</LoadingButton>
```

### ProgressBar

Progress indicator:

```typescript
<ProgressBar progress={75} />
<ProgressBar progress={100} variant="success" />
<ProgressBar progress={0} variant="error" animated={false} />
```

## Skeleton Loaders

Skeleton placeholder components:

```typescript
<Skeleton height="20px" width="100%" />
<ProposalCardSkeleton />
<StatsSkeleton />
<DashboardSkeleton />
```

## Usage Patterns

### Form Submission

```typescript
const SubmitForm = () => {
  const { isLoading, error, submit } = useFormSubmit(async () => {
    return submitData(formData);
  });

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await submit();
    }}>
      {error && <div>{error.message}</div>}
      <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
    </form>
  );
};
```

### Data Fetching

```typescript
const DataComponent = () => {
  const { isLoading, data, error, refresh } = useRefresh(async () => {
    return fetchData();
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data && <div>{data}</div>}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};
```

### Transaction Execution

```typescript
const TransactionComponent = () => {
  const { isLoading, execute } = useTransaction({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <LoadingButton isLoading={isLoading} onClick={executeTransaction}>
      Execute
    </LoadingButton>
  );
};
```

### Multi-Step Process

```typescript
const MultiStepProcess = () => {
  const { steps, executeStep, allComplete } = useMultiStep([
    { id: 'validate', name: 'Validate' },
    { id: 'submit', name: 'Submit' },
    { id: 'confirm', name: 'Confirm' },
  ]);

  return (
    <div>
      {steps.map(step => (
        <div key={step.id} className={step.status}>
          {step.name}
        </div>
      ))}
      {allComplete() && <div>Complete!</div>}
    </div>
  );
};
```

## Best Practices

1. **Use appropriate hook**: Choose the hook that matches your operation type
2. **Provide callbacks**: Use onSuccess and onError for side effects
3. **Display loading UI**: Always show loading state to users
4. **Handle errors**: Always provide error handling and display
5. **Cleanup**: Use abort controllers and cleanup functions
6. **Combine hooks**: Layer multiple hooks for complex operations

## Integration Examples

### Create Proposal Form

```typescript
const CreateProposal = () => {
  const { isLoading, execute } = useTransaction({
    onSuccess: (txId) => {
      toast.success('Proposal created!');
      resetForm();
    },
  });

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await execute(() => submitProposal());
    }}>
      <LoadingButton isLoading={isLoading}>Create</LoadingButton>
    </form>
  );
};
```

### Proposals List

```typescript
const ProposalsList = () => {
  const { isLoading, data: proposals, refresh } = useRefresh(
    fetchProposals
  );

  if (isLoading) return <ListSkeleton />;

  return (
    <div>
      {proposals?.map(p => <ProposalCard key={p.id} proposal={p} />)}
      <button onClick={refresh}>Refresh</button>
    </div>
  );
};
```

### Voting Interface

```typescript
const VotingInterface = () => {
  const { isLoading, execute } = useTransaction({
    onSuccess: () => {
      toast.success('Vote submitted!');
      refreshProposals();
    },
  });

  return (
    <div>
      <LoadingButton isLoading={isLoading} onClick={() => execute(submitVote)}>
        Vote
      </LoadingButton>
    </div>
  );
};
```
