# Wallet Hydration Implementation Reference

This document provides reference examples for implementing wallet hydration state management across different scenarios.

## Basic Implementation Pattern

### Store Definition
```typescript
export interface WalletState {
  address: string | null;
  connected: boolean;
  loading: boolean;  // Key: Starts as true to prevent race
  connect: () => void;
  disconnect: () => void;
  hydrate: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  connected: false,
  loading: true,  // Start loading to block premature renders
  
  hydrate: () => {
    // Check persistent storage and set loading to false
    try {
      if (stacksIsConnected()) {
        const addr = getStoredStxAddress();
        set({ address: addr, connected: !!addr, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
```

## Protected Page Pattern

### Dashboard Example
```typescript
export function DashboardPage() {
  const walletLoading = useWalletLoading();
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const connect = useWalletConnect();

  // Block render during hydration
  if (walletLoading) {
    return <LoadingSpinner />;
  }

  // Prevent race condition flash
  if (!connected) {
    return (
      <div className="text-center">
        <h1>Dashboard</h1>
        <p>Connect your wallet to view your dashboard.</p>
        <button onClick={connect}>Connect Wallet</button>
      </div>
    );
  }

  // Wallet ready and connected
  return <div>Dashboard content</div>;
}
```

## Header Component Pattern

### ConnectWallet Button
```typescript
export const ConnectWallet = memo(function ConnectWallet() {
  const loading = useWalletLoading();
  const address = useWalletAddress();
  const connected = useWalletConnected();
  const connect = useWalletConnect();
  const disconnect = useWalletDisconnect();

  // Show loading during hydration
  if (loading) {
    return (
      <div role="status" aria-label="Loading wallet status">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  // Show connected state
  if (connected && address) {
    return (
      <div>
        <span>{truncateAddress(address)}</span>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  // Show connect prompt
  return <button onClick={connect}>Connect Wallet</button>;
});
```

## App Initialization Pattern

### Root Component
```typescript
export default function App() {
  const hydrate = useWalletStore((s) => s.hydrate);

  // Hydrate on first render
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

## Loading Spinner Component

```typescript
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen" role="presentation">
      <div className="flex flex-col items-center gap-4" aria-live="polite" aria-busy="true">
        <div 
          className="h-10 w-10 animate-spin rounded-full border-4 border-t-green"
          role="status"
          aria-label="Loading wallet information"
        />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}
```

## State Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   App Mount                         │
│  Initial: loading=true, connected=false             │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            Pages Check Loading State                │
│   if (loading) return <LoadingSpinner />            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│            App Calls hydrate()                      │
│  Check localStorage for stored connection           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    Connected            Not Connected
    ┌────────┐           ┌────────┐
    │ loading: false  │   │ loading: false  │
    │ connected: true │   │ connected: false│
    │ address: 'SP...'│   │ address: null   │
    └────┬───────────┘   └────┬───────────┘
         │                     │
         ▼                     ▼
    ┌─────────────────┐  ┌──────────────────┐
    │ Dashboard/      │  │ Connect Wallet   │
    │ Profile/Create  │  │ Prompt           │
    │ Proposal Shows  │  │ No Flash!        │
    │ Protected Cont. │  │ Clean UX         │
    └─────────────────┘  └──────────────────┘
```

## Testing Patterns

### Unit Test for Hydration
```typescript
it('shows loading spinner while hydrating', () => {
  vi.mocked(useWalletLoading).mockReturnValue(true);
  
  render(<DashboardPage />);
  
  expect(screen.getByRole('status')).toBeInTheDocument();
});

it('shows connect button after hydration when not connected', () => {
  vi.mocked(useWalletLoading).mockReturnValue(false);
  vi.mocked(useWalletConnected).mockReturnValue(false);
  
  render(<DashboardPage />);
  
  expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
});
```

### Integration Test
```typescript
it('prevents race condition flash', () => {
  const renders = [];
  
  // Initial: loading true, prevents render
  renders.push('hydrating');
  
  // Hydration completes
  renders.push('hydrate-complete');
  
  // Now check actual state
  renders.push('show-connected-or-disconnected');
  
  expect(renders).not.toContain('show-disconnected-then-connected');
});
```

## Common Patterns to Avoid

### ❌ Wrong: Direct connected check without loading
```typescript
// WRONG - will flash Connect Wallet during hydration
if (!connected) {
  return <ConnectWalletPrompt />;
}
```

### ✅ Right: Check loading first
```typescript
// CORRECT - blocks render during hydration
if (loading) {
  return <LoadingSpinner />;
}

if (!connected) {
  return <ConnectWalletPrompt />;
}
```

### ❌ Wrong: Initializing loading as false
```typescript
// WRONG - race condition exists
export const useWalletStore = create<WalletState>((set) => ({
  loading: false,  // Bad - components render before hydrate
}));
```

### ✅ Right: Initialize loading as true
```typescript
// CORRECT - prevents premature render
export const useWalletStore = create<WalletState>((set) => ({
  loading: true,  // Good - blocks until hydrate completes
}));
```

## Selectors Pattern

```typescript
export const useWalletLoading = () =>
  useWalletStore((s: WalletState) => s.loading);

export const useWalletConnected = () =>
  useWalletStore((s: WalletState) => s.connected);

export const useWalletAddress = () =>
  useWalletStore((s: WalletState) => s.address);
```

Benefits:
- Components only re-render when their specific state changes
- `useWalletLoading` changes don't re-render `useWalletAddress` subscribers
- Prevents unnecessary re-renders and improves performance
