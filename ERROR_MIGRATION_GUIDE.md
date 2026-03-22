# Migrating to Error Handling System

## Overview

This guide shows how to migrate existing components from silent error handling to the new explicit error handling system.

## Before and After Examples

### Example 1: API Component

#### Before
```typescript
export const Dashboard = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getStxBalance(address)
      .then(setBalance)
      .catch(() => {
        console.error('Failed to load balance');
      })
      .finally(() => setIsLoading(false));
  }, [address]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {balance && <div>{balance} STX</div>}
      {!isLoading && !balance && <div>Error loading balance</div>}
    </div>
  );
};
```

#### After
```typescript
import { useAsyncError } from '@/hooks/useAsyncError';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export const Dashboard = () => {
  const { error, isLoading, execute, retry, clearError } = useAsyncError();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    execute(async () => {
      const bal = await getStxBalance(address);
      setBalance(bal);
      return bal;
    });
  }, [address]);

  return (
    <div>
      {error && (
        <ErrorMessage
          error={error}
          onRetry={() => retry(() => getStxBalance(address))}
          onDismiss={clearError}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {balance && <div>{balance} STX</div>}
    </div>
  );
};
```

### Example 2: List Component with Pagination

#### Before
```typescript
export const ProposalList = ({ page = 1 }) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getProposalsPage({ page, pageSize: 10 })
      .then(data => setProposals(data.proposals))
      .catch(() => {
        setProposals([]);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  if (isLoading) return <div>Loading...</div>;
  if (proposals.length === 0) return <div>No proposals</div>;

  return proposals.map(p => <ProposalCard key={p.id} proposal={p} />);
};
```

#### After
```typescript
import { useAsyncError } from '@/hooks/useAsyncError';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export const ProposalList = ({ page = 1 }) => {
  const { error, isLoading, execute, retry, clearError } = useAsyncError();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    execute(async () => {
      const data = await getProposalsPage({ page, pageSize: 10 });
      setProposals(data.proposals);
      return data;
    });
  }, [page]);

  return (
    <div>
      {error && (
        <ErrorMessage
          error={error}
          onRetry={() => retry(() => getProposalsPage({ page, pageSize: 10 }))}
          onDismiss={clearError}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {!isLoading && proposals.length === 0 && !error && <div>No proposals</div>}
      {proposals.map(p => (
        <ProposalCard key={p.id} proposal={p} />
      ))}
    </div>
  );
};
```

### Example 3: Multiple Async Operations

#### Before
```typescript
export const Dashboard = ({ address }) => {
  const [balance, setBalance] = useState(null);
  const [stake, setStake] = useState(null);

  useEffect(() => {
    Promise.all([
      getStxBalance(address).catch(() => null),
      getStake(address).catch(() => null),
    ]).then(([bal, s]) => {
      setBalance(bal);
      setStake(s);
    });
  }, [address]);

  return (
    <div>
      <div>Balance: {balance || 'Error'}</div>
      <div>Stake: {stake || 'Error'}</div>
    </div>
  );
};
```

#### After
```typescript
export const Dashboard = ({ address }) => {
  const balance = useAsyncError();
  const stake = useAsyncError();

  useEffect(() => {
    balance.execute(() => getStxBalance(address));
    stake.execute(() => getStake(address));
  }, [address]);

  return (
    <div className="space-y-4">
      <div>
        <h3>Balance</h3>
        {balance.error && (
          <ErrorMessage
            error={balance.error}
            onRetry={() => balance.retry(() => getStxBalance(address))}
            onDismiss={balance.clearError}
          />
        )}
        {balance.isLoading && <div>Loading...</div>}
        {balance.data && <div>{balance.data} STX</div>}
      </div>

      <div>
        <h3>Stake</h3>
        {stake.error && (
          <ErrorMessage
            error={stake.error}
            onRetry={() => stake.retry(() => getStake(address))}
            onDismiss={stake.clearError}
          />
        )}
        {stake.isLoading && <div>Loading...</div>}
        {stake.data && <div>{stake.data} STX</div>}
      </div>
    </div>
  );
};
```

## Common Migration Patterns

### Pattern 1: Simple Data Loading

**Old:**
```typescript
useState(null);
.catch(() => null)
```

**New:**
```typescript
const { data, error, isLoading, execute, retry } = useAsyncError();
execute(fn);
```

### Pattern 2: Error State

**Old:**
```typescript
.catch(() => setError('Error loading'));
{error && <div>{error}</div>}
```

**New:**
```typescript
{error && <ErrorMessage error={error} onRetry={retry} />}
```

### Pattern 3: Retry Logic

**Old:**
```typescript
<button onClick={() => refetch()}>Retry</button>
```

**New:**
```typescript
<ErrorMessage error={error} onRetry={retry} />
```

### Pattern 4: Multiple Operations

**Old:**
```typescript
Promise.all([op1(), op2()]).catch(() => {})
```

**New:**
```typescript
const op1 = useAsyncError();
const op2 = useAsyncError();
```

## Migration Checklist

- [ ] Identify all `.catch()` handlers that suppress errors
- [ ] Replace with useAsyncError hook
- [ ] Add ErrorMessage component for error display
- [ ] Update error state management
- [ ] Test error scenarios
- [ ] Add retry functionality
- [ ] Update tests

## Step-by-Step Migration Process

### 1. Identify Components to Migrate

Look for components with:
- Silent error handling (`.catch(() => {})`)
- Error states that show generic messages
- No retry functionality
- Hardcoded empty/zero defaults on error

### 2. Add useAsyncError Hook

```typescript
const { error, data, isLoading, execute, retry, clearError } = useAsyncError();
```

### 3. Replace Promise Chain

**Before:**
```typescript
useEffect(() => {
  loadData()
    .then(setData)
    .catch(() => console.error('Failed'));
}, []);
```

**After:**
```typescript
useEffect(() => {
  execute(loadData);
}, []);
```

### 4. Add Error Display

```typescript
{error && (
  <ErrorMessage
    error={error}
    onRetry={() => retry(loadData)}
    onDismiss={clearError}
  />
)}
```

### 5. Update Conditional Rendering

**Before:**
```typescript
{isLoading && <Spinner />}
{!isLoading && data && <Content data={data} />}
{!isLoading && !data && <Empty />}
```

**After:**
```typescript
{error && <ErrorMessage />}
{isLoading && <Spinner />}
{!isLoading && data && <Content data={data} />}
{!isLoading && !data && !error && <Empty />}
```

### 6. Test Error Scenarios

```typescript
it('displays error message on failure', async () => {
  jest.spyOn(api, 'getData').mockRejectedValue(
    new AsyncError('Network error', ErrorCode.NETWORK_ERROR)
  );

  render(<Component />);
  await waitFor(() => {
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **Lazy Load Error Handling** - Import ErrorMessage only when needed
2. **Memoize Error Handler** - Use useCallback for retry handlers
3. **Batch Updates** - Combine multiple state updates
4. **Clean Up** - Clear errors when component unmounts

## Troubleshooting

### Issue: Component still shows empty state on error

**Solution:** Add error display above empty state:
```typescript
{error && <ErrorMessage />}
{data.length === 0 && !error && <Empty />}
```

### Issue: Retry button doesn't work

**Solution:** Ensure retry function is properly passed:
```typescript
onRetry={() => retry(() => execute(loadData))}
```

### Issue: Multiple async operations interfering

**Solution:** Use separate useAsyncError instances:
```typescript
const query1 = useAsyncError();
const query2 = useAsyncError();
```

## Best Practices

1. Always display error messages to users
2. Provide retry buttons for retryable errors
3. Use proper error codes for context
4. Log errors for monitoring
5. Test error scenarios
6. Handle edge cases
7. Provide fallback UI
8. Keep error messages user-friendly
