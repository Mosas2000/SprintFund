# Stake Lock Visibility Changelog

## [1.0.0] - 2026-04-28

### Added
- Comprehensive stake lock visibility system
- `DetailedStakeInfo` type for tracking total, locked, and available stake
- `useDetailedStake` hook for fetching detailed stake information
- `StakeDashboard` component for comprehensive stake display
- `StakeLockStatus` component showing stake breakdown
- `LockedStakeBreakdown` component with per-proposal details
- `StakeLockWarning` inline warning component
- `CompactStakeStatus` component for compact displays
- Stake withdrawal validation with lock state checking
- Stake status message utilities
- Stake unlock time calculator
- Comprehensive test coverage for all utilities
- Documentation in `frontend/docs/STAKE_LOCK_SYSTEM.md`

### Changed
- Dashboard page now shows detailed stake information
- Withdrawal flow validates against available stake
- Withdrawal confirmation dialog shows locked amounts
- Error messages explain why withdrawals are blocked

### Fixed
- Users can now see which funds are locked in active votes
- Clear indication of available vs locked stake
- Withdrawal attempts with locked funds show helpful error messages
- Users understand when funds will become available

### Benefits
- Prevents confusion about withdrawal failures
- Clear visibility into stake allocation
- Reduces support questions about locked funds
- Better user experience for stake management
- Transparent quadratic voting cost display
