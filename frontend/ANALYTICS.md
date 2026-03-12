# SprintFund frontend analytics typing guide

This document summarizes the typed analytics and contract-data model added for issue #132.

## Goals

- eliminate unsafe `any` usage in analytics views and helpers
- keep API response parsing consistent across CoinGecko, Hiro, and GitHub integrations
- centralize reusable chart payload models for Recharts and Chart.js callbacks
- make contract interaction results predictable for components and tests

## Type locations

### Shared frontend barrel

- [frontend/src/types.ts](src/types.ts)

This file re-exports the commonly used analytics, contract, and select-value types so components can import from a single entry point.

### Contract and blockchain types

- [frontend/src/types/contract.ts](src/types/contract.ts)

Includes:

- raw Clarity value wrappers
- contract proposal, stake, and vote shapes
- typed transaction callback payloads
- normalized contract and network error helpers

### Analytics and chart types

- [frontend/src/types/analytics.ts](src/types/analytics.ts)

Includes:

- external API response subsets for CoinGecko, Hiro, and GitHub
- reusable Recharts tooltip and legend payload contracts
- Chart.js tick callback value aliases
- shared props for analytics dashboard cards
- velocity, scheduled vote, and user session models

### Governance proposal types

- [frontend/types/governance.ts](types/governance.ts)

Includes the governance-facing proposal and voting models used by AI and proposal helper features.

### Select value unions

- [frontend/src/types/select-values.ts](src/types/select-values.ts)

Includes string literal unions used by form handlers and filters so UI state can avoid unsafe casts.

## Usage patterns

### Recharts tooltip components

Import shared tooltip contracts from the barrel and narrow only the payload shape that is specific to the chart.

Examples now live in:

- [frontend/components/analytics/FundingTimeline.tsx](components/analytics/FundingTimeline.tsx)
- [frontend/components/analytics/SuccessRateChart.tsx](components/analytics/SuccessRateChart.tsx)

### Chart.js tick callbacks

Use `ChartJsTickValue` for tick callback arguments and normalize with `Number(value)` before formatting labels.

Examples:

- [frontend/components/BudgetAllocator.tsx](components/BudgetAllocator.tsx)
- [frontend/components/TreasuryDashboard.tsx](components/TreasuryDashboard.tsx)
- [frontend/components/TreasuryForecasting.tsx](components/TreasuryForecasting.tsx)

### Literal unions in UI filters

When button groups or selects produce a fixed set of values, prefer literal arrays with `as const` or shared union aliases.

Examples:

- [frontend/components/VoteHistory.tsx](components/VoteHistory.tsx)
- [frontend/src/types/select-values.ts](src/types/select-values.ts)

## Validation

Current validation coverage includes:

- type-level tests for analytics, contract, and select-value definitions
- unit tests for analytics insight generation rules
- editor diagnostics on the affected components and utilities

## Maintenance rules

- add new external response shapes to [frontend/src/types/analytics.ts](src/types/analytics.ts) before using them in API helpers
- prefer `unknown` plus narrowing over `any` in error and callback code
- update [frontend/src/types.ts](src/types.ts) when a new shared type should be imported broadly
- keep component-local interfaces only for chart-specific payloads that cannot be shared cleanly
