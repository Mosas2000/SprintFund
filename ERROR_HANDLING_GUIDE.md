# Async Error Handling Implementation

## Overview

This implementation provides comprehensive error handling for async operations in the SprintFund application. It replaces silent failures with explicit error propagation and recovery strategies.

## Architecture

### Core Error Classes

- **AsyncError**: Base error class with error codes and status information
- **ApiError**: Extends AsyncError for API-specific failures
- **ContractError**: Extends AsyncError for contract call failures

### Error Codes

- `NETWORK_ERROR`: Network connection failed
- `TIMEOUT_ERROR`: Request timeout (408)
- `INVALID_RESPONSE`: Server response parsing failed
- `RATE_LIMIT`: Too many requests (429)
- `UNAUTHORIZED`: Authentication failed (401)
- `NOT_FOUND`: Resource not found (404)
- `SERVER_ERROR`: Server error (5xx)
- `CONTRACT_CALL_FAILED`: Stacks contract call failed
- `VALIDATION_FAILED`: Data validation failed
- `UNKNOWN`: Unknown error

## Updated Files

### Library Files

1. **async-errors.ts** (NEW)
   - AsyncError class definition
   - Error code enum
   - Error classification functions
   - User-friendly error messages

2. **fetch-utils.ts** (NEW)
   - fetchWithErrorHandling(): Fetch with timeout and error mapping
   - retryWithExponentialBackoff(): Retry with exponential backoff
   - Automatic error propagation

3. **api.ts** (MODIFIED)
   - getStxBalance() now throws ApiError on failure
   - getTxStatus() now throws ApiError on failure
   - Retry logic with exponential backoff
   - Proper error propagation instead of defaults

4. **stacks.ts** (MODIFIED)
   - readOnly() now throws ContractError
   - getProposalCount() now propagates errors
   - getProposal() now propagates errors
   - getStake() now validates and propagates errors
   - getMinStakeAmount() now propagates errors
   - All functions throw on actual failures (no silent defaults)

5. **retry-utils.ts** (NEW)
   - withRetry(): Decorator for retryable operations
   - withCache(): Cache results with TTL
   - generateCacheKey(): Utility for cache key generation

6. **error-recovery.ts** (NEW)
   - ErrorRecoveryManager: Centralized recovery strategies
   - Strategy registration system
   - Retry queue management
   - Per-error-code recovery strategies

### Component Files

1. **AsyncErrorBoundary.tsx** (NEW)
   - React error boundary for async errors
   - Automatic error catching and display
   - Retry button for retryable errors

2. **ErrorMessage.tsx** (NEW)
   - Display AsyncError with user-friendly messages
   - Dismissible errors
   - Retry button integration

### Hook Files

1. **useAsyncError.ts** (NEW)
   - Hook for managing async operations
   - execute(): Run async function with error handling
   - retry(): Retry failed operations
   - clearError(): Dismiss errors
   - Automatic loading state management

### Store Files

1. **error-store.ts** (NEW)
   - Zustand store for global error management
   - createAsyncErrorHandler(): Context-specific error handler
   - Central error tracking and dismissal

## Error Flow

### API Calls

```
API Call
  ↓
fetchWithErrorHandling()
  - Handles network errors
  - Handles timeouts
  - Maps HTTP status to ErrorCode
  ↓
retryWithExponentialBackoff()
  - Retries retryable errors
  - Exponential backoff with jitter
  - Max 3 retries by default
  ↓
Error thrown or data returned
```

### Contract Calls

```
Contract Call
  ↓
readOnly()
  - Calls Stacks SDK
  - Wraps errors in ContractError
  ↓
Validation
  - Validates response format
  - Throws ValidationError if invalid
  ↓
Error thrown or data cached
```

## Usage Examples

### Using useAsyncError Hook

```typescript
import { useAsyncError } from '@/hooks/useAsyncError';
import { getProposals } from '@/lib/stacks';

export function ProposalList() {
  const { error, isLoading, execute, retry, clearError } = useAsyncError();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    execute(async () => {
      const data = await getProposals();
      setProposals(data);
    });
  }, []);

  return (
    <>
      {error && (
        <ErrorMessage
          error={error}
          onRetry={() => retry(() => getProposals())}
          onDismiss={clearError}
        />
      )}
      {isLoading && <div>Loading...</div>}
      {!isLoading && proposals.map(p => (...))}
    </>
  );
}
```

### Using withRetry Wrapper

```typescript
import { withRetry } from '@/lib/retry-utils';
import { getStxBalance } from '@/lib/api';

const balance = await withRetry(
  () => getStxBalance(address),
  { maxRetries: 5, baseDelay: 2000 }
);
```

### Using AsyncErrorBoundary

```typescript
<AsyncErrorBoundary>
  <ProposalList />
</AsyncErrorBoundary>
```

### Global Error Store

```typescript
import { useErrorStore, createAsyncErrorHandler } from '@/store/error-store';

const errorHandler = createAsyncErrorHandler('proposal-list');

try {
  await loadProposals();
} catch (err) {
  if (err instanceof AsyncError) {
    errorHandler.handleError(err);
  }
}
```

## Error Recovery Strategies

### Network Error
- Wait 5 seconds before retry
- Suitable for temporary connectivity issues

### Timeout Error
- Wait 3 seconds before retry
- Increases effective timeout

### Rate Limit Error
- Wait 10 seconds before retry
- Respects server rate limits

## Benefits

1. **Explicit Error Handling**: No more silent failures
2. **User Feedback**: Clear error messages to users
3. **Automatic Retries**: Retryable errors retry automatically
4. **Recovery Strategies**: Different strategies per error type
5. **Type Safety**: TypeScript error types throughout
6. **Centralized Management**: Global error store for consistency
7. **Developer Experience**: Easy to add to existing components
8. **Debugging**: Full error context available

## Migration Guide

### For Existing Components

Replace error suppression with error propagation:

**Before:**
```typescript
export async function getProposals(): Promise<Proposal[]> {
  try {
    const data = await api.fetch(...);
    return data;
  } catch {
    return [];
  }
}
```

**After:**
```typescript
export async function getProposals(): Promise<Proposal[]> {
  const data = await api.fetch(...);
  return data;
}

// In component:
const { error, execute } = useAsyncError();
execute(getProposals).then(setProposals);
```

### For New Components

Use error handling from the start:

```typescript
export function MyComponent() {
  const { error, execute, retry } = useAsyncError();

  useEffect(() => {
    execute(async () => {
      const data = await fetchData();
      setState(data);
    });
  }, []);

  return (
    <>
      {error && <ErrorMessage error={error} onRetry={retry} />}
      {/* component content */}
    </>
  );
}
```

## Best Practices

1. **Always handle errors in components** - Use useAsyncError or ErrorBoundary
2. **Provide user feedback** - Show error messages, not empty states
3. **Enable retries** - Provide retry buttons for retryable errors
4. **Log errors** - Send to error tracking service if needed
5. **Test error scenarios** - Mock fetch failures in tests
6. **Use retry limits** - Don't retry indefinitely
7. **Cache strategically** - Use withCache for frequently accessed data
8. **Monitor rate limits** - Track 429 errors in production

## Testing

### Mocking Errors

```typescript
jest.mock('@/lib/api', () => ({
  getStxBalance: jest.fn().mockRejectedValue(
    new AsyncError(
      'Network error',
      ErrorCode.NETWORK_ERROR
    )
  )
}));
```

### Testing Error Boundaries

```typescript
it('displays error message on failure', async () => {
  render(<ProposalList />);
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **Exponential Backoff**: Prevents overwhelming the server
2. **Jitter**: Reduces thundering herd problem
3. **Caching**: Reduces API calls with TTL
4. **Selective Retries**: Only retries retryable errors
5. **Error Recovery**: Implements strategies instead of blind retries

## Future Enhancements

1. Error analytics and monitoring
2. Smart error recovery heuristics
3. User preference for retry strategies
4. Offline mode with queue
5. Error aggregation and deduplication
