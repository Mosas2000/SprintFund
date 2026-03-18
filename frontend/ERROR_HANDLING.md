# Error Handling and Contract Errors

This document covers error types and patterns used throughout SprintFund's TypeScript system.

## Contract Error Codes

All contract errors are mapped to human-readable error codes:

| Code | Name | Meaning |
|------|------|---------|
| 100 | ERR-NOT-AUTHORIZED | User not authorized to perform action |
| 101 | ERR-PROPOSAL-NOT-FOUND | Proposal with given ID does not exist |
| 102 | ERR-INSUFFICIENT-STAKE | User does not have enough stake |
| 103 | ERR-ALREADY-EXECUTED | Proposal has already been executed |
| 104 | ERR-ALREADY-VOTED | User has already voted on this proposal |
| 105 | ERR-VOTING-PERIOD-ENDED | Voting period for proposal has ended |
| 106 | ERR-VOTING-PERIOD-ACTIVE | Cannot execute during active voting |
| 107 | ERR-QUORUM-NOT-MET | Quorum threshold not met |
| 108 | ERR-AMOUNT-TOO-LOW | Requested amount is too low |
| 109 | ERR-AMOUNT-TOO-HIGH | Requested amount is too high |
| 110 | ERR-ZERO-AMOUNT | Amount cannot be zero |
| 111 | ERR-INSUFFICIENT-BALANCE | Insufficient balance for operation |
| 112 | ERR-PROPOSAL-EXPIRED | Proposal has expired |

## Error Type Hierarchy

```typescript
// Generic error with message
type ErrorWithMessage = {
  message: string;
}

// Contract-specific error
type ContractError = {
  message: string;
  code?: number;  // from CONTRACT_ERROR_CODES
  name?: string;  // human readable name
}

// Network error
type NetworkError = {
  message: string;
  status?: number;
  statusText?: string;
}

// API error response
type ErrorResponse = {
  success: false;
  error: string;
  code?: string;
  timestamp: number;
}
```

## Error Flow

### 1. Contract Call Error

```typescript
try {
  const result = await contractCall({
    functionName: 'create-proposal',
    functionArgs: [amount, title, description],
    cb: { onFinish, onCancel }
  });
} catch (err) {
  // Caught error from contract
  const message = getErrorMessage(err);

  if (isErrorWithMessage(err)) {
    // Extract message safely
    console.error('Contract error:', err.message);
  }

  if (isNetworkError(err)) {
    // Handle network-specific error
    console.error('Network error:', err.status);
  }
}
```

### 2. Read-Only Function Error

```typescript
export async function getProposal(id: number): Promise<Proposal | null> {
  try {
    const raw = await readOnly<Record<string, unknown>>(
      'get-proposal',
      [uintCV(id)]
    );

    if (!raw) {
      console.warn(`Proposal ${id} not found`);
      return null;
    }

    const validated = validateRawProposal(raw);
    if (!validated) {
      console.error(`Invalid proposal data for ID ${id}`);
      return null;
    }

    return rawProposalToProposal(id, validated);
  } catch (err) {
    console.error(`Error fetching proposal ${id}:`, getErrorMessage(err));
    return null;
  }
}
```

### 3. API Response Error

```typescript
async function fetchProposals(): Promise<Proposal[]> {
  try {
    const response = await fetch('/api/proposals');
    const data = (await response.json()) as unknown;

    if (isErrorResponse(data)) {
      throw new Error(`API error: ${data.error}`);
    }

    if (!isSuccessResponse<{ proposals: Proposal[] }>(data)) {
      throw new Error('Invalid response format');
    }

    return data.data.proposals;
  } catch (err) {
    console.error('Failed to fetch proposals:', getErrorMessage(err));
    return [];
  }
}
```

## Best Practices

### 1. Always Use Type Guards

```typescript
// Bad - type assertion without checking
const message = (err as Error).message;

// Good - use type guard
if (isErrorWithMessage(err)) {
  console.error(err.message);
}
```

### 2. Provide Fallback Messages

```typescript
const message = getErrorMessage(err, 'An unexpected error occurred');
```

### 3. Log Errors with Context

```typescript
try {
  const proposal = await getProposal(id);
} catch (err) {
  console.error(`Failed to load proposal ${id}:`, {
    error: getErrorMessage(err),
    proposalId: id,
    timestamp: new Date().toISOString()
  });
}
```

### 4. Handle Validation Errors

```typescript
const validated = validateRawProposal(raw);
if (!validated) {
  console.error('Validation failed for proposal data:', raw);
  return null;
}
```

### 5. Distinguish Error Types

```typescript
if (isNetworkError(err)) {
  // Handle network-specific error
  if (err.status === 404) {
    // Resource not found
  } else if (err.status === 500) {
    // Server error
  }
} else if (isErrorWithMessage(err)) {
  // Handle general error
  console.error(err.message);
}
```

## Error Handling in Components

```typescript
import { getErrorMessage } from '../types';

export const ProposalForm: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: CreateProposalInput) => {
    try {
      setError(null);
      await createProposal(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create proposal'));
    }
  };

  return (
    <>
      {error && <ErrorBanner message={error} />}
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>
    </>
  );
};
```

## Validation Errors

```typescript
// Validate before use
const input = validateCreateProposalInput(formData);
if (!input) {
  return {
    success: false,
    error: 'Please check form fields'
  };
}

const proposal = await createProposal(input);
```

## Creating Custom Errors

```typescript
class StakingError extends Error {
  constructor(
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'StakingError';
  }
}

throw new StakingError('Insufficient stake to vote', 'INSUFFICIENT_STAKE');
```

## Summary

- **Always validate data at boundaries**
- **Use type guards before accessing unknown data**
- **Provide meaningful error messages**
- **Log errors with full context**
- **Handle different error types appropriately**
- **Give users clear feedback about failures**
