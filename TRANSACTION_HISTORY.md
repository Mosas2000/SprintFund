# Transaction Status Tracking and History

This feature provides comprehensive transaction tracking and history for SprintFund users. Users can now monitor transaction status in real-time, view detailed transaction history, and receive automatic notifications when transactions are confirmed or fail.

## Features

### 1. Real-time Transaction Tracking
- Automatic polling of transaction status from Stacks API
- Displays pending, confirmed, failed, and dropped states
- Shows estimated confirmation time based on block height
- Updates confirmations count as blocks are mined

### 2. Transaction History Panel
- Accessible via floating action button (bottom-right corner)
- Keyboard shortcut: `Cmd+Shift+T` (or `Ctrl+Shift+T` on Windows/Linux)
- Filters by transaction status and type
- Sortable by timestamp (newest first)
- Clear transactions older than 30 days

### 3. Transaction Types Tracked
- **Stake**: STX staking operations
- **Unstake**: STX unstaking operations
- **Vote**: Proposal voting
- **Create Proposal**: Proposal creation
- **Execute**: Proposal execution

### 4. Status Indicators
- **Pending**: Yellow badge with clock icon, shows confirmation progress (X/3)
- **Confirmed**: Green badge with checkmark, transaction is finalized
- **Failed**: Red badge with X icon, transaction failed to execute
- **Dropped**: Gray badge with alert icon, transaction was dropped from mempool

### 5. Persistent Storage
- Transaction history is stored in localStorage
- Persists across browser sessions
- Automatically cleared transactions older than 30 days (manual or automatic)

### 6. Notifications
- Toast notifications on transaction status changes
- Automatic popup when transactions are confirmed
- Error notifications with details for failed transactions

### 7. Explorer Integration
- One-click link to view transactions on Stacks Explorer
- Links include chain specification (mainnet)

## Architecture

### Core Types (`types/transaction.ts`)
```typescript
TransactionStatus: 'pending' | 'confirmed' | 'failed' | 'dropped'
TransactionType: 'stake' | 'vote' | 'create-proposal' | 'execute' | 'unstake'
```

### Store (`store/transactions.ts`)
Zustand-based store providing:
- `addTransaction()` - Add new transaction to history
- `updateTransaction()` - Update transaction status
- `getPendingTransactions()` - Get all pending transactions
- `clearOldTransactions()` - Remove old completed transactions
- LocalStorage persistence

### Service (`services/stacks-api.ts`)
- `fetchTransaction()` - Get transaction details from Stacks API
- `getTransactionStatus()` - Map Stacks status to our status enum
- `estimateConfirmationTime()` - Calculate ETA based on block height
- `getExplorerUrl()` - Generate Stacks Explorer link

### Hooks

#### `useTransactionPolling()`
- Polls all pending transactions every 15 seconds
- Stops polling when transaction is confirmed/failed
- Timeout after 30 minutes
- Cleans up on unmount

#### `useTransactionNotifications()`
- Watches transaction store for status changes
- Shows toast notifications on confirmation/failure
- Integrates with react-hot-toast

#### `useRefreshOnConfirmation(callback)`
- Triggers callback when any transaction confirms
- Useful for refreshing proposal data after votes/creates
- 2-second delay to allow blockchain confirmation

#### `useTransaction(options)`
- Enhanced existing hook to auto-track transactions
- Options include: type, proposalId, amount, title, metadata
- Automatically creates transaction record in store

### Components

#### `TransactionHistory.tsx`
Main panel component with:
- Floating action button (fixed position)
- Slide-in modal panel
- Filter by status and type
- Clear old transactions button
- Keyboard shortcut support

#### `TransactionItem.tsx`
Individual transaction display with:
- Transaction label and type
- Status badge with confirmations
- Expandable details section
- Explorer link
- Relative timestamp
- Error display if transaction failed

#### `TransactionStatusBadge.tsx`
Reusable status indicator with:
- Color-coded icons
- Confirmation progress display
- ARIA labels for accessibility

## Usage

### For Developers

#### Track a New Transaction Type

1. Update `TransactionType` in `types/transaction.ts`
2. Use `useTransaction()` hook with the new type:

```typescript
const { execute } = useTransaction({
  type: 'new-type',
  title: 'Transaction Title',
  amount: 1000000,
  proposalId: 1,
  onSuccess: (txId) => {
    toast.success('Success!');
  },
});

await execute(async () => {
  return new Promise((resolve, reject) => {
    openContractCall({
      // ... contract call options
      onFinish: (data) => resolve(data.txId),
      onCancel: () => reject(new Error('Cancelled')),
    });
  });
});
```

#### Manual Transaction Addition

```typescript
import { useTransactionStore } from '@/store/transactions';

const { addTransaction } = useTransactionStore();

addTransaction({
  id: 'transaction-id',
  type: 'vote',
  status: 'pending',
  timestamp: Date.now(),
  proposalId: 1,
  title: 'Proposal Title',
});
```

#### Refresh on Confirmation

```typescript
import { useRefreshOnConfirmation } from '@/hooks/useRefreshOnConfirmation';

export function MyComponent() {
  const refreshData = useCallback(() => {
    // Fetch fresh data from contract
  }, []);

  useRefreshOnConfirmation(refreshData);

  return <div>...</div>;
}
```

### For Users

1. **View Transaction History**: Click the floating "Transactions" button or press `Cmd+Shift+T`
2. **Filter Transactions**: Use the status and type dropdowns
3. **View Details**: Click "Details" on a transaction to expand
4. **View on Explorer**: Click "View" to open in Stacks Explorer
5. **Clear History**: Click the trash icon to clear old transactions
6. **Notifications**: Check toast notifications for status updates

## API Integration

### Stacks API Endpoints Used

- `GET /extended/v1/tx/{txid}` - Get transaction details
- `GET /extended/v1/block?limit=1` - Get current block height

### Transaction Status Mapping

Stacks API status → Our status:
- `success` → `confirmed`
- `pending` → `pending`
- `abort_by_response` / `abort_by_post_condition` → `failed`
- `dropped_*` → `dropped`
- Error in `tx_result.repr` → `failed`

## Performance

- Polling interval: 15 seconds (configurable in hook)
- Poll timeout: 30 minutes (configurable)
- LocalStorage limit: Browser-dependent (typically 5-10 MB)
- Automatic cleanup: Removes confirmed transactions after 30 days

## Browser Support

- LocalStorage support required
- Tested on Chrome, Firefox, Safari, Edge
- Mobile responsive design

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast status indicators
- Semantic HTML structure

## Future Enhancements

- [ ] Export transaction history as CSV
- [ ] Filter by date range
- [ ] Search by proposal title or ID
- [ ] Retry failed transactions
- [ ] Custom notification sounds
- [ ] WebSocket support for real-time updates
- [ ] Multi-user transaction sync
- [ ] Transaction fee estimation
- [ ] Gas optimization suggestions
