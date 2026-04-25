# Migration Guide: Alignment with V3 Contract

This document outlines the changes and migration steps for aligning the SprintFund frontend and associated scripts with the `sprintfund-core-v3` contract.

## Rationale

The SprintFund project has evolved with improved logic and bug fixes in the `v3` version of the core contract. To ensure users interact with the most secure and feature-rich version of the protocol, the frontend and all maintenance scripts have been updated to target `sprintfund-core-v3` by default.

## Changes

### 1. Frontend Configuration

The default `CONTRACT_NAME` in `frontend/src/config.ts` has been updated:

```typescript
// Previous
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'sprintfund-core';

// Current
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'sprintfund-core-v3';
```

### 2. Kubernetes Configuration

The `frontend/k8s/configmap.yaml` now points to the `.sprintfund-core-v3` principal for the `contract-address` key.

### 3. Interaction Scripts

All scripts in the `scripts/` directory have been updated to target the `v3` contract by default:
- `stake.js`
- `create-proposal.js`
- `scripts/README.md` (examples and documentation)

### 4. Developer Environment

The `frontend/.env.example` has been updated to reflect the new default. Developers should update their local `.env.local` files accordingly.

## Migration Steps for Users

Since the `v3` contract maintains compatibility with the core DAO traits, existing users can continue their journey seamlessly. However, if state (like active proposals or stakes) was not migrated on-chain, users may need to re-stake on the `v3` contract.

1. **Check Stake**: Use the User Dashboard to verify your stake balance on the `v3` contract.
2. **Re-stake if necessary**: If your balance appears as 0, you may need to re-stake the minimum 10 STX to the new contract.
3. **Withdraw from V1**: Users with significant stake in the legacy `sprintfund-core` contract can use the provided `scripts/withdraw-legacy.js` (if provided) or interact directly with the old contract via the Stacks Explorer to recover their STX.

## Verification

To verify that you are interacting with the correct version, check the footer of the SprintFund application, which now displays the active contract identifier.
