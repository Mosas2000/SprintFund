# Wallet Hydration Race Condition Fix

## Problem
When the app loads, the `hydrate()` function is called on mount in `App.tsx`, but wallet-dependent pages (Dashboard, CreateProposal, Profile) would render before hydration completes. This caused:
- Flash of "Connect Wallet" state even for already-connected users
- Incorrect UI shown during the hydration window
- Poor user experience on page refresh

## Root Cause
The wallet store initialized with `loading: false`, allowing components to check `connected` status before `hydrate()` completed. The timing race between:
1. Initial render with `connected=false`
2. Async hydration checking localStorage
3. State update with actual connection status

Created a window where connected users saw the disconnected UI briefly.

## Solution
Implemented a three-part fix:

### 1. Loading State Management
- Changed initial wallet store state to `loading: true`
- `hydrate()` sets `loading: false` after completion
- `connect()` manages loading state during connection flow

### 2. Component Blocking
Added loading state checks to wallet-dependent pages:
- `Dashboard.tsx`: Shows `LoadingSpinner` while `walletLoading` is true
- `CreateProposal.tsx`: Shows `LoadingSpinner` while `walletLoading` is true
- `Profile.tsx`: Shows `LoadingSpinner` while `walletLoading` is true
- `ConnectWallet.tsx` (Header): Shows loading indicator during hydration

### 3. New LoadingSpinner Component
Created reusable `LoadingSpinner` component with:
- Accessible spinner with proper ARIA labels
- Consistent styling with app theme
- Used during wallet hydration

## Files Changed
- `frontend/src/store/wallet.ts` - Updated hydration and loading logic
- `frontend/src/store/wallet-selectors.ts` - Already exports loading selector
- `frontend/src/spa-pages/Dashboard.tsx` - Added loading check
- `frontend/src/spa-pages/CreateProposal.tsx` - Added loading check
- `frontend/src/spa-pages/Profile.tsx` - Added loading check
- `frontend/src/components/ConnectWallet.tsx` - Added loading state
- `frontend/src/components/LoadingSpinner.tsx` - New component
- Test files for all components and pages

## Flow
```
1. App mounts
2. Wallet store initializes: loading=true, connected=false
3. App.tsx calls hydrate()
4. hydrate() checks localStorage for stored connection
5. hydrate() sets loading=false
6. Pages now show appropriate UI based on connected status
7. No flash of wrong state
```

## Testing
Added comprehensive tests:
- Wallet store hydration tests
- Dashboard hydration flow tests
- CreateProposal hydration flow tests
- ConnectWallet loading state tests
- LoadingSpinner component tests

All tests verify:
- Loading spinner shows during hydration
- Wallet-dependent UI doesn't render while loading
- Correct UI appears after hydration completes
