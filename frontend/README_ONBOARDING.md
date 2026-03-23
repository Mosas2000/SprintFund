# SprintFund Onboarding System

A comprehensive first-time user onboarding flow designed to help new DAO participants understand governance, voting, and platform features.

## Overview

The onboarding system consists of:

1. **First-Time Visitor Detection** - Automatically identifies new users
2. **Interactive Tour** - Step-by-step guidance through key features
3. **DAO Concept Explanations** - Educational tooltips about blockchain concepts
4. **Progress Checklist** - Visual tracking of onboarding completion
5. **Getting Started Guide** - Comprehensive documentation
6. **FAQ Section** - Common questions and answers

## Key Features

### Automatic First-Time Detection
- Uses localStorage to track first visits
- Seamlessly integrated into the app initialization
- Customizable re-triggering for development/testing

### Interactive Tour Steps
The tour guides users through:
1. Welcome & Introduction
2. Wallet Connection
3. Staking & Voting Power
4. Proposals Browsing
5. Voting Mechanics
6. Dashboard Overview

### DAO Concept Education
Each step includes educational content about:
- Quadratic Voting
- STX Tokenomics
- Governance Principles
- Community Participation
- Smart Contracts

### Progress Tracking
- Visual checklist with completion percentage
- Persistent progress tracking
- Step-by-step completion validation
- Dismissible interface (collapsible widget)

## Architecture

### File Structure

```
frontend/src/
├── store/
│   └── onboarding.ts                 # Zustand store for state
├── providers/
│   └── OnboardingProvider.tsx         # Provider wrapper component
├── hooks/
│   ├── useOnboarding.ts              # Main onboarding hook
│   ├── useOnboardingActions.ts       # Step completion actions
│   └── useOnboardingDebug.ts         # Development utilities
├── components/
│   ├── OnboardingModal.tsx           # Tour modal display
│   ├── OnboardingTooltip.tsx         # Tooltip component
│   ├── OnboardingChecklist.tsx       # Progress widget
│   ├── OnboardingGuide.tsx           # Getting started content
│   └── OnboardingFAQ.tsx             # FAQ component
├── config/
│   └── onboarding-tour.ts            # Tour steps & concepts
├── utils/
│   └── first-time-visitor.ts         # Visitor detection
├── spa-pages/
│   ├── GettingStarted.tsx            # Getting started page
│   └── FAQ.tsx                       # FAQ page
└── docs/
    └── ONBOARDING_GUIDE.md           # Developer guide
```

### State Management

Using Zustand store (`store/onboarding.ts`):

```typescript
const {
  isFirstTime,           // Is this a first-time visitor?
  currentStep,           // Which tour step?
  completedSteps,        // Array of completed step IDs
  showModal,             // Show tour modal?
  showChecklist,         // Show progress checklist?
  setCurrentStep,        // Navigate to step
  markStepComplete,      // Mark step done
  setShowModal,          // Toggle modal
  setShowChecklist,      // Toggle checklist
  shouldShowOnboarding,  // Determine if to show onboarding
  resetOnboarding,       // Reset state (dev)
  initialize,            // Initialize from localStorage
} = useOnboardingStore();
```

## Usage

### For End Users

1. First-time visitors see the tour automatically on launch
2. Users can navigate through steps with Next/Previous buttons
3. The progress checklist appears in the bottom-right corner
4. Completed steps are marked with checkmarks
5. Users can access the Getting Started guide anytime at `/getting-started`
6. FAQs available at `/faq`

### For Developers

#### Mark a Step as Complete

```typescript
import { useOnboarding } from '../hooks/useOnboarding';

function MyComponent() {
  const { completeStep } = useOnboarding();

  const handleAction = async () => {
    await performAction();
    completeStep('step-id');
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

#### Check Onboarding Status

```typescript
import { useOnboarding } from '../hooks/useOnboarding';

function StatusDisplay() {
  const { isFirstTime, getCompletionPercentage, completedSteps } = useOnboarding();

  return (
    <div>
      {isFirstTime && <p>Welcome, first-time visitor!</p>}
      <p>Progress: {getCompletionPercentage()}%</p>
      <p>Completed: {completedSteps.length} steps</p>
    </div>
  );
}
```

#### Reset Onboarding (Development)

```typescript
import { useOnboardingDebug } from '../hooks/useOnboardingDebug';

function DevTools() {
  const { resetAndRestart, clearAllOnboardingData, getOnboardingStatus } =
    useOnboardingDebug();

  return (
    <div>
      <button onClick={resetAndRestart}>Reset & Restart</button>
      <button onClick={clearAllOnboardingData}>Clear All</button>
      <pre>{JSON.stringify(getOnboardingStatus(), null, 2)}</pre>
    </div>
  );
}
```

## Tour Steps

### Step 1: Welcome
- **ID**: welcome
- **Description**: Introduction to SprintFund
- **Concepts**: What is a DAO, How SprintFund Works

### Step 2: Wallet Connection
- **ID**: wallet-connect
- **Description**: Connecting Stacks wallet
- **Concepts**: Web3 Wallets, Security Best Practices

### Step 3: Staking
- **ID**: staking
- **Description**: Staking STX for voting power
- **Concepts**: STX Token, Quadratic Voting, Staking Rewards

### Step 4: Proposals
- **ID**: proposals
- **Description**: Browsing proposals
- **Concepts**: Proposal Types, Proposal Lifecycle

### Step 5: Voting
- **ID**: voting
- **Description**: Casting votes
- **Concepts**: How to Vote, Voting Power, Transparency, Incentives

### Step 6: Dashboard
- **ID**: dashboard
- **Description**: Monitoring activity
- **Concepts**: Voting History, Power Calculation

## DAO Concepts Covered

### Governance
How the DAO makes decisions through community voting.

### Quadratic Voting
Voting power scales with the square root of staked tokens, preventing whale dominance.

### Tokenomics
Economic model with STX tokens and participation incentives.

### Delegation
Temporarily transfer voting power to community members.

## Storage

The system uses localStorage with these keys:

- `sprintfund_first_visit` - JSON with timestamp of first visit
- `sprintfund_onboarding_completed` - Completion flag (boolean)
- `sprintfund_onboarding_steps` - JSON array of completed step IDs

## Animations

Smooth transitions using Framer Motion:
- Modal entrance/exit animations
- Tooltip appearance with spring physics
- Checklist item animations
- Progress bar animation
- Completion celebration

## Integration

The `OnboardingProvider` is integrated at the app root level in `main.tsx`:

```typescript
<StrictMode>
  <OnboardingProvider>
    <App />
  </OnboardingProvider>
</StrictMode>
```

This ensures the onboarding system is available throughout the entire application.

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Clear visual hierarchy
- High contrast colors

## Performance

- Lazy-loaded components
- Efficient state management with Zustand
- localStorage-based persistence
- No external API calls
- Minimal re-renders

## Future Enhancements

- Video tutorials for each step
- Multilingual support
- Customizable tour paths
- User feedback collection
- Step-specific notifications
- Advanced progress analytics
- A/B testing different tour variants
