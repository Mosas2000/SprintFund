# Migration Glossary

## Terms and Definitions

### A

**Adoption Rate**  
The percentage of users who have successfully migrated from the old contract to the new contract.

**Active Migration Period**  
The timeframe during which the migration wizard is available and actively supported (typically 30 days).

### C

**Contract Migration**  
The process of moving from one version of a smart contract to another, involving user asset transfers and state preservation.

**Contract Principal**  
The full identifier of a smart contract on Stacks, format: `<address>.<contract-name>`

### D

**Deprecation**  
The phase when the old contract UI is hidden by default but the contract remains accessible.

**Dry Run**  
A test execution of a migration script that shows what would happen without actually broadcasting transactions.

### E

**End of Support**  
The date after which active migration support ends (typically 60 days after migration start).

### G

**Gas Fees**  
Transaction fees paid in STX to execute blockchain operations. Migration typically costs ~0.03 STX.

### L

**Legacy Contract**  
An older version of the smart contract that users are migrating away from.

**Lock Expiration**  
The block height at which vote locks expire, allowing users to withdraw or migrate their stake.

### M

**Migration Eligibility**  
Whether a user can currently migrate, determined by having assets in the legacy contract and no active vote locks.

**Migration Success Rate**  
The percentage of migration attempts that complete successfully without errors.

**Migration Wizard**  
The step-by-step UI component that guides users through the migration process.

**MicroSTX**  
The smallest unit of STX. 1 STX = 1,000,000 microSTX.

### P

**Post-Migration**  
The period after the active migration phase, typically days 31-60.

**Pre-Migration**  
The planning and preparation phase before migration launch, typically 2-4 weeks.

### R

**Reputation**  
A score tracking user contributions and participation in the DAO, preserved during migration.

**Rollback**  
The process of reverting to the old contract if critical issues are discovered in the new contract.

### S

**Stake**  
STX tokens locked in the contract to participate in governance.

**State Preservation**  
The process of maintaining user data (stake, reputation) during migration.

**Success Criteria**  
Measurable goals that define a successful migration (e.g., >90% adoption, >95% success rate).

### T

**Transaction Confirmation**  
The process of a transaction being included in a block and verified on the blockchain, typically 10-30 minutes.

### V

**Vote Lock**  
A temporary restriction on withdrawing stake due to active votes on proposals.

**Version Mismatch**  
When the frontend is configured for a different contract version than expected.

---

## Acronyms

**DAO**  
Decentralized Autonomous Organization

**DApp**  
Decentralized Application

**FAQ**  
Frequently Asked Questions

**KPI**  
Key Performance Indicator

**SLA**  
Service Level Agreement

**STX**  
Stacks token, the native cryptocurrency of the Stacks blockchain

**UI**  
User Interface

**UX**  
User Experience

---

## Technical Terms

**Block Height**  
The number of blocks in the blockchain from genesis to a specific point. Used to measure time on the blockchain.

**Blockchain Explorer**  
A web interface for viewing blockchain data, transactions, and contract state.

**Clarity**  
The smart contract programming language used on Stacks.

**Contract Call**  
A transaction that invokes a function in a smart contract.

**Immutable**  
Cannot be changed. Smart contracts on Stacks are immutable once deployed.

**Mainnet**  
The main Stacks blockchain network where real value transactions occur.

**Read-Only Function**  
A contract function that reads data without modifying state or requiring a transaction.

**Smart Contract**  
Self-executing code deployed on the blockchain that enforces rules and manages assets.

**Testnet**  
A test version of the Stacks blockchain for development and testing.

**Transaction ID (TxID)**  
A unique identifier for a blockchain transaction.

**Wallet**  
Software that manages private keys and allows interaction with blockchain applications.

---

## Migration-Specific Terms

**Claim Mechanism**  
The process by which users prove ownership of assets in the old contract to receive them in the new contract.

**Dual-Contract Support**  
A period when the frontend supports both old and new contracts simultaneously.

**Grace Period**  
Extended time allowed for users to complete migration after the initial deadline.

**Migration Banner**  
A persistent notification in the UI alerting users to available migration.

**Migration Modal**  
A popup dialog that guides users through the migration process step-by-step.

**Migration Report**  
A document showing migration progress, statistics, and user status.

**Migration Status**  
The current state of a user's migration (ready, blocked, complete, etc.).

**Partial Migration**  
Migrating only a portion of staked assets, leaving the rest in the old contract.

**Snapshot**  
A record of contract state at a specific point in time, used for verification.

---

## Status Terms

**Active**  
Currently in progress or available.

**Blocked**  
Unable to proceed due to constraints (e.g., vote locks).

**Complete**  
Successfully finished.

**Deprecated**  
No longer recommended for use but still functional.

**Failed**  
Attempted but unsuccessful.

**In Progress**  
Currently being executed.

**Pending**  
Waiting for action or confirmation.

**Ready**  
Prepared and able to proceed.

---

## Metric Terms

**Average Response Time**  
The mean time taken to respond to support requests.

**Conversion Rate**  
The percentage of users who complete migration after seeing the prompt.

**Cumulative Total**  
The running total of migrations over time.

**Success Rate**  
The percentage of attempts that succeed.

**Throughput**  
The number of migrations completed per unit of time.

---

## Risk Terms

**Critical Risk**  
A risk that could cause data loss, fund lockup, or security vulnerability.

**High Risk**  
A risk that could significantly degrade user experience or cause partial data loss.

**Medium Risk**  
A risk that causes minor inconvenience with available workarounds.

**Low Risk**  
A risk with minimal functional impact, typically cosmetic issues.

**Mitigation**  
Actions taken to reduce the likelihood or impact of a risk.

---

## Support Terms

**Escalation**  
The process of elevating an issue to higher-level support or engineering.

**First Response Time**  
The time from when a support ticket is created to when it receives its first response.

**Resolution Time**  
The total time from ticket creation to issue resolution.

**Support Ticket**  
A formal request for assistance with a problem or question.

**Triage**  
The process of prioritizing support requests based on severity and impact.

---

**Glossary Version**: 1.0  
**Last Updated**: 2026-04-29  
**Maintained By**: SprintFund Core Team
