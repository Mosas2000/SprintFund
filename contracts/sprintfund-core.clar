;; SprintFund Core Contract
;; This is the main contract for the SprintFund DAO
;; Enables lightning-fast micro-grants ($50-200 STX) with quadratic voting and reputation tracking

;; ============================================
;; Constants
;; ============================================

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u101))
(define-constant ERR-INSUFFICIENT-STAKE (err u102))
(define-constant ERR-ALREADY-EXECUTED (err u103))

;; ============================================
;; Data Variables
;; ============================================

;; Contract owner (DAO administrator)
(define-data-var contract-owner principal tx-sender)

;; Total number of proposals created
(define-data-var proposal-count uint u0)

;; Minimum stake required to submit a proposal (10 STX in microSTX)
(define-data-var min-stake-amount uint u10000000)

;; ============================================
;; Data Maps
;; ============================================

;; Proposals map: stores all proposal details
;; Key: proposal-id (unique identifier)
;; Value: proposal data tuple
(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    amount: uint,
    title: (string-utf8 100),
    description: (string-utf8 500),
    votes-for: uint,
    votes-against: uint,
    executed: bool,
    created-at: uint
  }
)

;; Stakes map: tracks staked amounts per user
;; Key: user principal
;; Value: staked amount in microSTX
(define-map stakes
  { staker: principal }
  { amount: uint }
)

;; ============================================
;; Read-Only Functions
;; ============================================

;; Get proposal details by ID
;; @param proposal-id: The unique identifier of the proposal
;; @returns: Optional tuple containing proposal details
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

;; Get the current proposal count
;; @returns: Total number of proposals created
(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

;; Get stake amount for a user
;; @param staker: The principal to check
;; @returns: Optional tuple containing stake amount
(define-read-only (get-stake (staker principal))
  (map-get? stakes { staker: staker })
)

;; Get the minimum stake amount required
;; @returns: Minimum stake in microSTX
(define-read-only (get-min-stake-amount)
  (ok (var-get min-stake-amount))
)

;; Get the contract owner
;; @returns: Principal of the contract owner
(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

;; ============================================
;; Initialization
;; ============================================

;; Contract automatically initializes with tx-sender as owner
;; The contract-owner is set via the define-data-var above
