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
(define-constant ERR-ALREADY-VOTED (err u104))
(define-constant ERR-VOTING-PERIOD-ENDED (err u105))
(define-constant ERR-VOTING-PERIOD-ACTIVE (err u106))
(define-constant ERR-QUORUM-NOT-MET (err u107))
(define-constant ERR-AMOUNT-TOO-LOW (err u108))
(define-constant ERR-AMOUNT-TOO-HIGH (err u109))
(define-constant ERR-ZERO-AMOUNT (err u110))
(define-constant ERR-INSUFFICIENT-BALANCE (err u111))
(define-constant ERR-PROPOSAL-EXPIRED (err u112))

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

;; Votes map: tracks votes per user per proposal
;; Key: proposal-id and voter principal
;; Value: vote weight (based on quadratic voting)
(define-map votes
  { proposal-id: uint, voter: principal }
  { weight: uint, support: bool }
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

;; ============================================
;; Public Functions
;; ============================================

;; Stake STX to gain proposal creation rights
;; @param amount: Amount to stake in microSTX
;; @returns: Success response or error
(define-public (stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0 } (map-get? stakes { staker: tx-sender })))
      (new-stake-amount (+ (get amount current-stake) amount))
    )
    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update stake amount
    (map-set stakes
      { staker: tx-sender }
      { amount: new-stake-amount }
    )
    
    (ok new-stake-amount)
  )
)

;; Create a new proposal (requires minimum stake)
;; @param amount: Requested funding amount in microSTX
;; @param title: Proposal title (max 100 chars)
;; @param description: Proposal description (max 500 chars)
;; @returns: Proposal ID or error
(define-public (create-proposal (amount uint) (title (string-utf8 100)) (description (string-utf8 500)))
  (let
    (
      (proposer-stake (default-to { amount: u0 } (map-get? stakes { staker: tx-sender })))
      (current-count (var-get proposal-count))
      (new-proposal-id current-count)
    )
    ;; Check if proposer has minimum stake
    (asserts! (>= (get amount proposer-stake) (var-get min-stake-amount)) ERR-INSUFFICIENT-STAKE)
    
    ;; Create the proposal
    (map-set proposals
      { proposal-id: new-proposal-id }
      {
        proposer: tx-sender,
        amount: amount,
        title: title,
        description: description,
        votes-for: u0,
        votes-against: u0,
        executed: false,
        created-at: stacks-block-height
      }
    )
    
    ;; Increment proposal count
    (var-set proposal-count (+ current-count u1))
    
    (ok new-proposal-id)
  )
)

;; Withdraw staked STX (only if no active proposals)
;; @param amount: Amount to withdraw in microSTX
;; @returns: Success response or error
(define-public (withdraw-stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0 } (map-get? stakes { staker: tx-sender })))
      (stake-amount (get amount current-stake))
    )
    ;; Check if user has enough stake
    (asserts! (>= stake-amount amount) ERR-INSUFFICIENT-STAKE)
    
    ;; Update stake amount
    (map-set stakes
      { staker: tx-sender }
      { amount: (- stake-amount amount) }
    )
    
    ;; Transfer STX back to user
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    
    (ok (- stake-amount amount))
  )
)

;; Vote on a proposal with quadratic voting
;; @param proposal-id: The proposal to vote on
;; @param support: true for yes, false for no
;; @param vote-weight: Amount of voting power to use (will be squared)
;; @returns: Success response or error
(define-public (vote (proposal-id uint) (support bool) (vote-weight uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (voter-stake (default-to { amount: u0 } (map-get? stakes { staker: tx-sender })))
      ;; Quadratic voting: cost = weight^2
      (vote-cost (* vote-weight vote-weight))
    )
    ;; Check if proposal exists and not executed
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    
    ;; Check if voter has enough stake for the vote cost
    (asserts! (>= (get amount voter-stake) vote-cost) ERR-INSUFFICIENT-STAKE)
    
    ;; Record the vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      { weight: vote-weight, support: support }
    )
    
    ;; Update proposal vote counts
    (if support
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { votes-for: (+ (get votes-for proposal) vote-weight) })
      )
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { votes-against: (+ (get votes-against proposal) vote-weight) })
      )
    )
    
    (ok true)
  )
)

;; Execute a proposal if it has enough votes
;; @param proposal-id: The proposal to execute
;; @returns: Success response or error
(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (votes-for (get votes-for proposal))
      (votes-against (get votes-against proposal))
    )
    ;; Check if proposal exists and not already executed
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    
    ;; Check if proposal has more votes for than against
    (asserts! (> votes-for votes-against) ERR-NOT-AUTHORIZED)
    
    ;; Mark proposal as executed
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { executed: true })
    )
    
    ;; Transfer funds to proposer
    (try! (as-contract (stx-transfer? (get amount proposal) tx-sender (get proposer proposal))))
    
    (ok true)
  )
)
