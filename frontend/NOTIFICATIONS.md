# Notification System

Comprehensive notification system for SprintFund governance events.

## Features

- In-app notification bell with unread badge
- Real-time notifications via WebSocket connection to Stacks API
- Polling fallback for proposal updates
- Push notifications (browser Notification API)
- Notification sound with opt-out
- Email digest preferences (for future backend integration)
- Quorum detection alerts
- Grouping and filtering utilities

## Notification Types

- `proposal_created` - New proposal submitted
- `proposal_executed` - Proposal executed on-chain
- `vote_milestone` - Proposal reached vote threshold (5, 10, 25, 50, 100)
- `quorum_reached` - Proposal reached quorum (default: 50 votes)
- `stake_change` - User stake position changed
- `vote_received` - Vote cast on user proposal

## Usage

### Enable WebSocket notifications

```typescript
import { useWebSocketNotifications } from '../hooks/useWebSocketNotifications';

function MyComponent() {
  const { connectionState } = useWebSocketNotifications();
  return <div>Status: {connectionState}</div>;
}
```

### Enable polling

```typescript
import { useNotificationPolling } from '../hooks/useNotificationPolling';

function MyComponent() {
  useNotificationPolling(true);
  return null;
}
```

### Configure preferences

```typescript
import { loadPreferences, savePreferences } from '../lib/notifications';

const prefs = loadPreferences();
prefs.quorum_reached = false;
savePreferences(prefs);
```

## Components

- `NotificationBell` - Bell icon with unread badge
- `NotificationDropdown` - Notification panel
- `NotificationItem` - Individual notification
- `NotificationPreferences` - Settings panel
- `NotificationToast` - Brief popup notification

## Storage

All preferences and notification history are persisted in localStorage:
- `sprintfund-notifications` - notification history (max 100)
- `sprintfund-notification-preferences` - type enable/disable
- `sprintfund-notification-sound` - sound on/off
- `sprintfund-email-preferences` - email digest settings
