/**
 * Visual variant for the confirmation dialog.
 *
 * - `warning`  - amber styling, used for risky but recoverable actions (stake, vote)
 * - `danger`   - red styling, used for irreversible actions (execute, withdraw)
 * - `info`     - green styling, used for neutral confirmations (create proposal)
 */
export type DialogVariant = 'warning' | 'danger' | 'info';
