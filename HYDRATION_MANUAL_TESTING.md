# Manual Testing Guide for Wallet Hydration Fix

## Pre-Test Setup
1. Clear browser localStorage before each test
2. Open browser DevTools Network tab to see timing
3. Enable DevTools Performance recording for visual confirmation

## Test Scenarios

### Scenario 1: Fresh Browser Session (No Prior Connection)
**Steps:**
1. Open app in fresh browser with cleared localStorage
2. Observe the page loading state
3. Wallet should show loading spinner briefly, then "Connect Wallet" button

**Expected Result:**
- No flash of wallet state changes
- Smooth transition from loading to "Connect Wallet" prompt
- No "connected" state appears

### Scenario 2: Returning Connected User
**Steps:**
1. In existing browser session with connected wallet
2. Refresh the page (Cmd+R or Ctrl+R)
3. Immediately observe header and wallet state

**Expected Result:**
- Loading spinner appears during hydration
- Connected wallet address shown in header (not "Connect Wallet")
- No flash of disconnected state
- Dashboard/Profile/Create Proposal pages load correctly

### Scenario 3: Dashboard Access When Connected
**Steps:**
1. Navigate to `/dashboard` with connected wallet
2. Refresh page
3. Observe initial load state

**Expected Result:**
- Loading spinner shows first
- Dashboard content loads after hydration
- No "Connect Wallet" prompt visible during hydration
- All user stats display correctly

### Scenario 4: Create Proposal Access When Connected
**Steps:**
1. Navigate to `/proposals/create` with connected wallet
2. Refresh page
3. Check initial render

**Expected Result:**
- Loading spinner appears during hydration
- Form displays after loading completes
- No redirect to landing page
- Can interact with form immediately

### Scenario 5: Profile Access When Connected
**Steps:**
1. Navigate to `/profile` with connected wallet
2. Refresh page
3. Monitor state changes

**Expected Result:**
- Loading spinner shown during hydration
- Profile data loads after hydration
- No connection prompt flashes
- All profile sections render correctly

### Scenario 6: Manual Connection Flow
**Steps:**
1. Start with disconnected wallet in fresh session
2. Click "Connect Wallet" button
3. Approve connection in wallet extension
4. Observe state change

**Expected Result:**
- Connect button briefly shows loading state
- Address appears in header after successful connection
- No duplicate connection prompts
- Can navigate to protected pages

### Scenario 7: Disconnection Flow
**Steps:**
1. Start with connected wallet
2. Click "Disconnect" button
3. Observe immediate state change

**Expected Result:**
- Address immediately replaced with "Connect Wallet" button
- No loading state shown
- Can reconnect without issues

### Scenario 8: Network Throttling (Slow Connection)
**Steps:**
1. Open DevTools Network tab
2. Select "Slow 3G" throttling
3. Refresh page with connected wallet
4. Observe loading duration

**Expected Result:**
- Loading spinner persists until hydration completes
- No state flashing even with slow hydration
- Page content renders after complete loading

### Scenario 9: Multiple Tab Synchronization
**Steps:**
1. Open app in two browser tabs
2. Connect wallet in first tab
3. Switch to second tab and refresh
4. Check synchronization

**Expected Result:**
- Second tab detects connection from first tab
- No race conditions in either tab
- State consistent across tabs

### Scenario 10: Component Tests Running
**Steps:**
1. Run: `npm run test`
2. Observe all hydration-related tests passing
3. Check coverage for wallet and page components

**Expected Result:**
- All wallet hydration tests pass
- All page hydration tests pass
- All LoadingSpinner tests pass
- No test failures or warnings

## Performance Metrics to Verify

- Loading spinner appears within 50ms of page load
- Hydration completes within 100-200ms
- No layout shifts or flashing visible
- Memory usage stable (no leaks)

## Common Issues to Check

1. **Issue:** "Connect Wallet" still flashes briefly
   - **Check:** Is `walletLoading` properly exported in selectors?
   - **Check:** Are all pages checking loading before rendering?

2. **Issue:** Loading spinner doesn't disappear
   - **Check:** Does hydrate() set `loading: false`?
   - **Check:** Is connect() managing loading state?

3. **Issue:** Connected state not persisting
   - **Check:** Is localStorage being read correctly?
   - **Check:** Does hydrate() check `stacksIsConnected()`?

4. **Issue:** Multiple hydration calls
   - **Check:** Is hydrate() being called multiple times?
   - **Check:** Is useEffect dependency array correct?

## Rollback Procedure

If issues occur:
```bash
git revert HEAD~15..HEAD
npm install
npm run dev
```

## Accessibility Verification

- [ ] Screen reader announces "Loading wallet information"
- [ ] Page is keyboard navigable during loading
- [ ] Loading spinner is properly marked with `role="status"`
- [ ] Tab order is logical throughout loading and loaded states
- [ ] Color contrast maintained during all states
