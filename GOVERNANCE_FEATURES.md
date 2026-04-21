# Governance Features Documentation

## Issue #265: Live Contract Event Stream

### Overview
A real-time feed of contract and governance events that allows users to track DAO activity as it happens.

### Components

#### ContractEventStream.tsx
Main UI component displaying a filterable event feed.

**Props:**
- `contractPrincipal: string` - The contract to monitor
- `apiUrl?: string` - Hiro API endpoint (default: mainnet)
- `pollInterval?: number` - Polling interval in ms (default: 20000)

**Features:**
- Real-time event polling
- Filterable by event category (stake, proposal, vote, cancel, execute, treasury)
- Show/hide failed transactions
- Manual refresh button
- Explorer links for each event

#### contract-events.ts
Core logic for fetching and normalizing contract events.

**Functions:**
- `fetchContractEventStream()` - Fetches events from Hiro API
- `normalizeContractTransaction()` - Converts raw transactions to readable events

**Event Categories:**
- `stake` - Staking transactions
- `proposal` - New proposals
- `vote` - Voting transactions
- `cancel` - Cancelled proposals
- `execute` - Executed proposals
- `treasury` - Treasury transfers

### Usage

```tsx
import { ContractEventStream } from '@/components/dashboard/ContractEventStream';

export default function Page() {
  return (
    <ContractEventStream 
      contractPrincipal="SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund"
      pollInterval={20000}
    />
  );
}
```

---

## Issue #259: Governance Notifications

### Overview
Automated notifications for important governance events, helping users stay informed without constant app refreshing.

### Components

#### GovernanceNotificationManager.tsx
Manages the notification system lifecycle and UI.

**Features:**
- Floating notification bell with unread count
- Settings button for preferences
- Automatic event monitoring
- Toast notifications

#### NotificationPreferencesModal.tsx
Settings UI for notification preferences.

**Configurable Events:**
- New proposals
- Voting updates
- Executed proposals
- Cancelled proposals
- Delegation received

**Features:**
- Toggle individual notification types
- Enable/disable all at once
- Persistent storage

#### NotificationDisplay.tsx
Toast notification component that auto-dismisses.

**Features:**
- Auto-dismiss after 6 seconds
- Action links to relevant pages
- Smooth fade-out animation
- Close button

#### NotificationCenterDropdown.tsx
Dropdown notification panel with full history.

**Features:**
- View all notifications
- Mark as read/unread
- Dismiss individual notifications
- Clear all notifications
- Unread count badge

### Hooks

#### useNotifications()
Manages notification state and lifecycle.

```tsx
const {
  notifications,
  addNotification,
  dismissNotification,
  markAsRead,
  clearAll,
} = useNotifications();
```

#### useContractEvents()
Monitors contract events with callbacks.

```tsx
const { events, isLoading, error, refetch } = useContractEvents({
  contractPrincipal: '...',
  onNewEvent: (event) => { /* Handle new event */ },
});
```

#### useGovernanceEventNotifications()
Automatically creates notifications from contract events.

```tsx
const { events, isLoading } = useGovernanceEventNotifications({
  contractPrincipal: '...',
  enabled: true,
});
```

### Services

#### governance-notification-preferences.ts
Manages user notification preferences (localStorage).

```tsx
import {
  getGovernanceNotificationPreferences,
  saveGovernanceNotificationPreferences,
  updateGovernanceNotificationPreference,
} from '@/lib/governance-notification-preferences';
```

#### governance-notifications.ts
Creates notifications from governance events.

```tsx
const notification = createGovernanceNotification('proposalCreated', {
  proposalId: '42',
  proposalTitle: 'Budget Allocation',
});
```

### Usage

```tsx
export default function RootLayout() {
  return (
    <Providers>
      <GovernanceNotificationManager 
        contractPrincipal="SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund" 
      />
      {/* ... rest of app */}
    </Providers>
  );
}
```

### Integration Points

1. **Root Layout** - Notification manager rendered globally
2. **Dashboard** - Event stream displays recent activity
3. **Header** - Notification bell icon with unread count
4. **User Settings** - Preference management panel

### Data Flow

```
Contract Events (Hiro API)
    ↓
useContractEvents()
    ↓
useGovernanceEventNotifications()
    ↓
Notification Preferences
    ↓
createGovernanceNotification()
    ↓
NotificationDisplay (Toast)
NotificationCenterDropdown (Dropdown)
```

### Storage

User notification preferences are stored in localStorage with key `governance-notification-prefs`.

```json
{
  "proposalCreated": true,
  "proposalVoting": true,
  "proposalExecuted": true,
  "proposalCancelled": false,
  "delegationReceived": true
}
```

---

## Testing

Both features include comprehensive unit tests:

- `contract-events.test.ts` - Event normalization and API fetching
- `governance-notifications.test.ts` - Notification creation and deduplication
- `governance-notification-preferences.test.ts` - Preference storage
- `useContractEvents.test.ts` - Hook behavior and callbacks

Run tests with:
```bash
npm run test
```

---

## API Reference

### Hiro API
Events are fetched from the Stacks API at:
```
https://api.mainnet.hiro.so/extended/v2/addresses/{contractPrincipal}/transactions
```

### Event Structure
```typescript
interface ContractEvent {
  id: string;
  txId: string;
  timestamp: number;
  sender: string;
  category: 'stake' | 'proposal' | 'vote' | 'cancel' | 'execute' | 'treasury';
  status: 'success' | 'failed';
  description: string;
  amount?: string;
  weight?: number;
  proposalId?: string;
}
```

---

## Performance Considerations

1. **Polling** - Default 20s for events, 30s for notifications
2. **Deduplication** - Notifications deduplicated within 30s window
3. **Memory** - Events kept in memory; old toasts auto-dismiss
4. **Storage** - Preferences use localStorage (persistent, ~1KB)

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage required for preference persistence
- Requires ES2020+ JavaScript support
