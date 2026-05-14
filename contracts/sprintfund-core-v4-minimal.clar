;; SprintFund Core Contract (v4-minimal)
;; Optimized version with all security fixes, minimal features
;; Target: <1 STX deployment cost

;; ============================================
;; Constants
;; ============================================

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
(define-constant ERR-STAKE-LOCKED (err u114))
(define-constant ERR-TIMELOCK-ACTIVE (err u115))

;; Governance parameters
(define-constant VOTING-PERIOD-BLOCKS u432) ;; ~3 days
(define-constant TIMELOCK-BLOCKS u144) ;; ~1 day
(define-constant HIGH-VALUE-THRESHOLD u100000000) ;; 100 STX
(define-constant QUORUM-PERCENTAGE u10) ;; 10%
(define-constant MAX-PROPOSAL-AMOUNT u1000000000) ;; 1000 STX
(define-constant MIN-PROPOSAL-AMOUNT u1000000) ;; 1 STX
(define-constant STAKE-LOCKUP-BLOCKS u144) ;; ~1 day

;; ============================================
;; Data Variables
;; ============================================

(define-data-var contract-owner principal tx-sender)
(define-data-var proposal-count uint u0)
(define-data-var min-stake-amount uint u10000000) ;; 10 STX
(define-data-var total-staked uint u0)

;; ============================================
;; Data Maps
;; ============================================

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
    created-at: uint,
    voting-ends-at: uint,
    execution-allowed-at: uint
  }
)

(define-map stakes
  { staker: principal }
  { 
    amount: uint,
    locked-until: uint
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  { 
    weight: uint, 
    support: bool,
    cost-paid: uint
  }
)

(define-map vote-costs
  { staker: principal }
  { total-cost: uint }
)

;; ============================================
;; Read-Only Functions
;; ============================================

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

(define-read-only (get-stake (staker principal))
  (map-get? stakes { staker: staker })
)

(define-read-only (get-min-stake-amount)
  (ok (var-get min-stake-amount))
)

(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

(define-read-only (get-total-staked)
  (ok (var-get total-staked))
)

(define-read-only (get-version)
  (ok u4)
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

(define-read-only (get-required-quorum)
  (ok (/ (* (var-get total-staked) QUORUM-PERCENTAGE) u100))
)

(define-read-only (get-available-stake (staker principal))
  (let
    (
      (stake-data (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: staker })))
      (vote-cost-data (default-to { total-cost: u0 } (map-get? vote-costs { staker: staker })))
    )
    (ok (- (get amount stake-data) (get total-cost vote-cost-data)))
  )
)

;; ============================================
;; Public Functions
;; ============================================

(define-public (stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (new-stake-amount (+ (get amount current-stake) amount))
    )
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set stakes
      { staker: tx-sender }
      { amount: new-stake-amount, locked-until: (get locked-until current-stake) }
    )
    (var-set total-staked (+ (var-get total-staked) amount))
    (print { event: "stake", staker: tx-sender, amount: amount })
    (ok new-stake-amount)
  )
)

(define-public (withdraw-stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (stake-amount (get amount current-stake))
      (vote-cost-data (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
      (available-amount (- stake-amount (get total-cost vote-cost-data)))
    )
    (asserts! (>= stacks-block-height (get locked-until current-stake)) ERR-STAKE-LOCKED)
    (asserts! (>= available-amount amount) ERR-INSUFFICIENT-STAKE)
    (map-set stakes
      { staker: tx-sender }
      { amount: (- stake-amount amount), locked-until: (get locked-until current-stake) }
    )
    (var-set total-staked (- (var-get total-staked) amount))
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (print { event: "unstake", staker: tx-sender, amount: amount })
    (ok (- stake-amount amount))
  )
)

(define-public (create-proposal (amount uint) (title (string-utf8 100)) (description (string-utf8 500)))
  (let
    (
      (proposer-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (current-count (var-get proposal-count))
      (new-proposal-id current-count)
      (voting-end-block (+ stacks-block-height VOTING-PERIOD-BLOCKS))
      (execution-block (if (>= amount HIGH-VALUE-THRESHOLD)
        (+ voting-end-block TIMELOCK-BLOCKS)
        voting-end-block
      ))
    )
    (asserts! (>= (get amount proposer-stake) (var-get min-stake-amount)) ERR-INSUFFICIENT-STAKE)
    (asserts! (>= amount MIN-PROPOSAL-AMOUNT) ERR-AMOUNT-TOO-LOW)
    (asserts! (<= amount MAX-PROPOSAL-AMOUNT) ERR-AMOUNT-TOO-HIGH)
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
        created-at: stacks-block-height,
        voting-ends-at: voting-end-block,
        execution-allowed-at: execution-block
      }
    )
    (var-set proposal-count (+ current-count u1))
    (print { event: "proposal-created", proposal-id: new-proposal-id, proposer: tx-sender })
    (ok new-proposal-id)
  )
)

(define-public (vote (proposal-id uint) (support bool) (vote-weight uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (voter-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (current-vote-costs (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
      (existing-vote (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
      (vote-cost (* vote-weight vote-weight))
      (available-stake (- (get amount voter-stake) (get total-cost current-vote-costs)))
    )
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (<= stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ENDED)
    (asserts! (is-none existing-vote) ERR-ALREADY-VOTED)
    (asserts! (>= available-stake vote-cost) ERR-INSUFFICIENT-STAKE)
    
    ;; Deduct vote cost
    (map-set vote-costs
      { staker: tx-sender }
      { total-cost: (+ (get total-cost current-vote-costs) vote-cost) }
    )
    
    ;; Lock stake
    (map-set stakes
      { staker: tx-sender }
      { 
        amount: (get amount voter-stake), 
        locked-until: (+ stacks-block-height STAKE-LOCKUP-BLOCKS)
      }
    )
    
    ;; Record vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      { weight: vote-weight, support: support, cost-paid: vote-cost }
    )
    
    ;; Update proposal
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
    
    (print { event: "vote", proposal-id: proposal-id, voter: tx-sender, support: support })
    (ok true)
  )
)

(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (votes-for (get votes-for proposal))
      (votes-against (get votes-against proposal))
      (total-votes (+ votes-for votes-against))
      (required-quorum (/ (* (var-get total-staked) QUORUM-PERCENTAGE) u100))
    )
    (asserts! (is-eq tx-sender (get proposer proposal)) ERR-NOT-AUTHORIZED)
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (> stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ACTIVE)
    (asserts! (>= stacks-block-height (get execution-allowed-at proposal)) ERR-TIMELOCK-ACTIVE)
    (asserts! (>= total-votes required-quorum) ERR-QUORUM-NOT-MET)
    (asserts! (> votes-for votes-against) ERR-NOT-AUTHORIZED)
    
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { executed: true })
    )
    
    (try! (as-contract (stx-transfer? (get amount proposal) tx-sender (get proposer proposal))))
    (print { event: "proposal-executed", proposal-id: proposal-id })
    (ok true)
  )
)

(define-public (reclaim-vote-cost (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (vote-data (unwrap! (map-get? votes { proposal-id: proposal-id, voter: tx-sender }) ERR-NOT-AUTHORIZED))
      (current-vote-costs (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
    )
    (asserts! (> stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ACTIVE)
    (map-set vote-costs
      { staker: tx-sender }
      { total-cost: (- (get total-cost current-vote-costs) (get cost-paid vote-data)) }
    )
    (print { event: "vote-cost-reclaimed", proposal-id: proposal-id, voter: tx-sender })
    (ok true)
  )
)
