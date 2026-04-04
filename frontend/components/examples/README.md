# Example Components

This directory contains example components demonstrating best practices for common patterns in the SprintFund application.

## Components

### DashboardWithErrorHandling.tsx

Demonstrates handling multiple independent async operations with error handling:

- **Pattern**: Multiple data fetches with separate error states
- **Features**:
  - Individual error handlers per section
  - Retry functionality for each operation
  - Loading states per section
  - Error dismissal

**Usage Example:**
```tsx
import { DashboardWithErrorHandling } from '@/components/examples/DashboardWithErrorHandling';

function App() {
  return <DashboardWithErrorHandling address="SP123..." />;
}
```

### ProposalListWithErrorHandling.tsx

Demonstrates paginated data fetching with error handling:

- **Pattern**: Paginated list with error recovery
- **Features**:
  - Page-based data loading
  - Global error state for the list
  - Retry after error
  - Empty state handling
  - Loading state management

**Usage Example:**
```tsx
import { ProposalListWithErrorHandling } from '@/components/examples/ProposalListWithErrorHandling';

function ProposalsPage() {
  return <ProposalListWithErrorHandling page={1} pageSize={10} />;
}
```

## Common Patterns

All examples use:

- **useAsyncError hook**: For consistent error handling
- **ErrorMessage component**: For standardized error UI
- **TypeScript**: Full type safety
- **Loading states**: Visual feedback during async operations
- **Retry functionality**: Allow users to recover from errors

## When to Use These Patterns

- Use **DashboardWithErrorHandling** pattern when you have multiple independent data sources on a single page
- Use **ProposalListWithErrorHandling** pattern when implementing paginated lists with server-side data

## Related Documentation

- [Error Handling Guide](../../ERROR_HANDLING_GUIDE.md)
- [useAsyncError Hook](../../src/hooks/useAsyncError.ts)
- [ErrorMessage Component](../common/ErrorMessage.tsx)
