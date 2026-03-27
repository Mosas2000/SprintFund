;; SprintFund Core Contract V2
;; Upgraded version with security fixes and governance improvements
;; Addresses issues #11-#21, #25, #86

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
(define-constant ERR-PROPOSAL-CANCELLED (err u113))
(define-constant ERR-STAKE-LOCKED (err u114))
(define-constant ERR-TIMELOCK-ACTIVE (err u115))

;; Voting period duration (approx 3 days at 10 min blocks)
(define-constant VOTING-PERIOD-BLOCKS u432)

;; Timelock for high-value proposals (approx 1 day)
(define-constant TIMELOCK-BLOCKS u144)

;; High-value threshold (100 STX)
(define-constant HIGH-VALUE-THRESHOLD u100000000)

;; Minimum quorum percentage (10% of total staked)
(define-constant QUORUM-PERCENTAGE u10)

;; Maximum proposal amount (1000 STX)
(define-constant MAX-PROPOSAL-AMOUNT u1000000000)

;; Stake lockup period after voting (approx 1 day)
(define-constant STAKE-LOCKUP-BLOCKS u144)

;; ============================================
;; Data Variables
;; ============================================

;; Contract owner (DAO administrator)
(define-data-var contract-owner principal tx-sender)

;; Total number of proposals created
(define-data-var proposal-count uint u0)

;; Minimum stake required to submit a proposal (10 STX in microSTX)
(define-data-var min-stake-amount uint u10000000)

;; Total staked amount across all users
(define-data-var total-staked uint u0)

;; Treasury balance for proposal funding
(define-data-var treasury-balance uint u0)

;; ============================================
;; Data Maps
;; ============================================

;; Proposals map: stores all proposal details
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
    cancelled: bool,
    created-at: uint,
    voting-ends-at: uint,
    execution-allowed-at: uint
  }
)

;; Stakes map: tracks staked amounts per user
(define-map stakes
  { staker: principal }
  { 
    amount: uint,
    locked-until: uint
  }
)

;; Votes map: tracks votes per user per proposal
(define-map votes
  { proposal-id: uint, voter: principal }
  { weight: uint, support: bool, cost-paid: uint }
)

;; Vote cost tracking: amount deducted from stake for voting
(define-map vote-costs
  { staker: principal }
  { total-cost: uint }
)

;; ============================================
;; Events (Print statements for off-chain indexing)
;; ============================================

;; Event types for off-chain indexing (#20)
(define-private (emit-stake-event (staker principal) (amount uint) (new-balance uint))
  (print { event: "stake", staker: staker, amount: amount, new-balance: new-balance })
)

(define-private (emit-unstake-event (staker principal) (amount uint) (new-balance uint))
  (print { event: "unstake", staker: staker, amount: amount, new-balance: new-balance })
)

(define-private (emit-proposal-created-event (proposal-id uint) (proposer principal) (amount uint) (title (string-utf8 100)))
  (print { event: "proposal-created", proposal-id: proposal-id, proposer: proposer, amount: amount, title: title })
)

(define-private (emit-vote-event (proposal-id uint) (voter principal) (support bool) (weight uint) (cost uint))
  (print { event: "vote", proposal-id: proposal-id, voter: voter, support: support, weight: weight, cost: cost })
)

(define-private (emit-proposal-executed-event (proposal-id uint) (proposer principal) (amount uint))
  (print { event: "proposal-executed", proposal-id: proposal-id, proposer: proposer, amount: amount })
)

(define-private (emit-proposal-cancelled-event (proposal-id uint) (proposer principal))
  (print { event: "proposal-cancelled", proposal-id: proposal-id, proposer: proposer })
)

;; ============================================
;; Read-Only Functions
;; ============================================

;; Get proposal details by ID
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

;; Get the current proposal count
(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

;; Get stake amount for a user
(define-read-only (get-stake (staker principal))
  (map-get? stakes { staker: staker })
)

;; Get the minimum stake amount required
(define-read-only (get-min-stake-amount)
  (ok (var-get min-stake-amount))
)

;; Get the contract owner
(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

;; Get total staked amount
(define-read-only (get-total-staked)
  (ok (var-get total-staked))
)

;; Get treasury balance
(define-read-only (get-treasury-balance)
  (ok (var-get treasury-balance))
)

;; Check if a user has voted on a proposal
(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

;; Calculate required quorum for current total stake
(define-read-only (get-required-quorum)
  (ok (/ (* (var-get total-staked) QUORUM-PERCENTAGE) u100))
)

;; Check if proposal voting period has ended
(define-read-only (is-voting-ended (proposal-id uint))
  (match (map-get? proposals { proposal-id: proposal-id })
    proposal (ok (> stacks-block-height (get voting-ends-at proposal)))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; Check if proposal can be executed (timelock passed)
(define-read-only (can-execute (proposal-id uint))
  (match (map-get? proposals { proposal-id: proposal-id })
    proposal (ok (and 
      (> stacks-block-height (get voting-ends-at proposal))
      (>= stacks-block-height (get execution-allowed-at proposal))
      (not (get executed proposal))
      (not (get cancelled proposal))
    ))
    ERR-PROPOSAL-NOT-FOUND
  )
)

;; Get available stake (total minus vote costs)
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
;; Admin Functions (#21)
;; ============================================

;; Update minimum stake amount (owner only)
(define-public (set-min-stake-amount (new-amount uint))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (asserts! (> new-amount u0) ERR-ZERO-AMOUNT)
    (var-set min-stake-amount new-amount)
    (print { event: "min-stake-updated", new-amount: new-amount })
    (ok true)
  )
)

;; Transfer ownership
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
    (var-set contract-owner new-owner)
    (print { event: "ownership-transferred", new-owner: new-owner })
    (ok true)
  )
)

;; Deposit to treasury (for proposal funding) (#17)
(define-public (deposit-treasury (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set treasury-balance (+ (var-get treasury-balance) amount))
    (print { event: "treasury-deposit", depositor: tx-sender, amount: amount })
    (ok true)
  )
)

;; ============================================
;; Public Functions
;; ============================================

;; Stake STX to gain proposal creation rights
(define-public (stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (new-stake-amount (+ (get amount current-stake) amount))
    )
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    
    ;; Update stake amount
    (map-set stakes
      { staker: tx-sender }
      { amount: new-stake-amount, locked-until: (get locked-until current-stake) }
    )
    
    ;; Update total staked
    (var-set total-staked (+ (var-get total-staked) amount))
    
    ;; Emit event
    (emit-stake-event tx-sender amount new-stake-amount)
    
    (ok new-stake-amount)
  )
)

;; Create a new proposal with validation (#14, #16)
(define-public (create-proposal (amount uint) (title (string-utf8 100)) (description (string-utf8 500)))
  (let
    (
      (proposer-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (current-count (var-get proposal-count))
      (new-proposal-id current-count)
      (voting-end-block (+ stacks-block-height VOTING-PERIOD-BLOCKS))
      ;; High-value proposals require timelock (#86)
      (execution-block (if (>= amount HIGH-VALUE-THRESHOLD)
        (+ voting-end-block TIMELOCK-BLOCKS)
        voting-end-block
      ))
    )
    ;; Check if proposer has minimum stake
    (asserts! (>= (get amount proposer-stake) (var-get min-stake-amount)) ERR-INSUFFICIENT-STAKE)
    
    ;; Validate amount bounds (#16)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (<= amount MAX-PROPOSAL-AMOUNT) ERR-AMOUNT-TOO-HIGH)
    
    ;; Check treasury has enough funds (#17)
    (asserts! (>= (var-get treasury-balance) amount) ERR-INSUFFICIENT-BALANCE)
    
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
        cancelled: false,
        created-at: stacks-block-height,
        voting-ends-at: voting-end-block,
        execution-allowed-at: execution-block
      }
    )
    
    ;; Increment proposal count
    (var-set proposal-count (+ current-count u1))
    
    ;; Emit event
    (emit-proposal-created-event new-proposal-id tx-sender amount title)
    
    (ok new-proposal-id)
  )
)

;; Cancel a proposal (proposer only, before voting ends) (#25)
(define-public (cancel-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
    )
    ;; Only proposer can cancel
    (asserts! (is-eq tx-sender (get proposer proposal)) ERR-NOT-AUTHORIZED)
    
    ;; Cannot cancel if already executed or cancelled
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (not (get cancelled proposal)) ERR-PROPOSAL-CANCELLED)
    
    ;; Can only cancel during voting period
    (asserts! (<= stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ENDED)
    
    ;; Mark as cancelled
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { cancelled: true })
    )
    
    ;; Emit event
    (emit-proposal-cancelled-event proposal-id tx-sender)
    
    (ok true)
  )
)

;; Withdraw staked STX with lockup check (#18)
(define-public (withdraw-stake (amount uint))
  (let
    (
      (current-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (stake-amount (get amount current-stake))
      (vote-cost-data (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
      (available-amount (- stake-amount (get total-cost vote-cost-data)))
    )
    ;; Check lockup period (#18)
    (asserts! (>= stacks-block-height (get locked-until current-stake)) ERR-STAKE-LOCKED)
    
    ;; Check if user has enough available stake (not used for voting)
    (asserts! (>= available-amount amount) ERR-INSUFFICIENT-STAKE)
    
    ;; Update stake amount
    (map-set stakes
      { staker: tx-sender }
      { amount: (- stake-amount amount), locked-until: (get locked-until current-stake) }
    )
    
    ;; Update total staked
    (var-set total-staked (- (var-get total-staked) amount))
    
    ;; Transfer STX back to user
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    
    ;; Emit event
    (emit-unstake-event tx-sender amount (- stake-amount amount))
    
    (ok (- stake-amount amount))
  )
)

;; Vote on a proposal with quadratic voting - fixes #12, #13
(define-public (vote (proposal-id uint) (support bool) (vote-weight uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (voter-stake (default-to { amount: u0, locked-until: u0 } (map-get? stakes { staker: tx-sender })))
      (current-vote-costs (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
      (existing-vote (map-get? votes { proposal-id: proposal-id, voter: tx-sender }))
      ;; Quadratic voting: cost = weight^2
      (vote-cost (* vote-weight vote-weight))
      (available-stake (- (get amount voter-stake) (get total-cost current-vote-costs)))
    )
    ;; Check if proposal is not executed or cancelled
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (not (get cancelled proposal)) ERR-PROPOSAL-CANCELLED)
    
    ;; Check voting period (#14)
    (asserts! (<= stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ENDED)
    
    ;; Prevent double voting (#12)
    (asserts! (is-none existing-vote) ERR-ALREADY-VOTED)
    
    ;; Check if voter has enough stake for the vote cost
    (asserts! (>= available-stake vote-cost) ERR-INSUFFICIENT-STAKE)
    
    ;; Deduct vote cost from available stake (#13)
    (map-set vote-costs
      { staker: tx-sender }
      { total-cost: (+ (get total-cost current-vote-costs) vote-cost) }
    )
    
    ;; Lock stake for lockup period (#18)
    (map-set stakes
      { staker: tx-sender }
      { 
        amount: (get amount voter-stake), 
        locked-until: (+ stacks-block-height STAKE-LOCKUP-BLOCKS) 
      }
    )
    
    ;; Record the vote
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      { weight: vote-weight, support: support, cost-paid: vote-cost }
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
    
    ;; Emit event
    (emit-vote-event proposal-id tx-sender support vote-weight vote-cost)
    
    (ok true)
  )
)

;; Execute a proposal - fixes #11, #15
(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (votes-for (get votes-for proposal))
      (votes-against (get votes-against proposal))
      (total-votes (+ votes-for votes-against))
      (required-quorum (/ (* (var-get total-staked) QUORUM-PERCENTAGE) u100))
    )
    ;; Only proposer can execute (#11)
    (asserts! (is-eq tx-sender (get proposer proposal)) ERR-NOT-AUTHORIZED)
    
    ;; Check if proposal exists and not already executed or cancelled
    (asserts! (not (get executed proposal)) ERR-ALREADY-EXECUTED)
    (asserts! (not (get cancelled proposal)) ERR-PROPOSAL-CANCELLED)
    
    ;; Check voting period has ended (#14)
    (asserts! (> stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ACTIVE)
    
    ;; Check timelock for high-value proposals (#86)
    (asserts! (>= stacks-block-height (get execution-allowed-at proposal)) ERR-TIMELOCK-ACTIVE)
    
    ;; Check minimum quorum (#15)
    (asserts! (>= total-votes required-quorum) ERR-QUORUM-NOT-MET)
    
    ;; Check if proposal has more votes for than against
    (asserts! (> votes-for votes-against) ERR-NOT-AUTHORIZED)
    
    ;; Check treasury balance (#17)
    (asserts! (>= (var-get treasury-balance) (get amount proposal)) ERR-INSUFFICIENT-BALANCE)
    
    ;; Mark proposal as executed
    (map-set proposals
      { proposal-id: proposal-id }
      (merge proposal { executed: true })
    )
    
    ;; Update treasury balance
    (var-set treasury-balance (- (var-get treasury-balance) (get amount proposal)))
    
    ;; Transfer funds from treasury to proposer (#17)
    (try! (as-contract (stx-transfer? (get amount proposal) tx-sender (get proposer proposal))))
    
    ;; Emit event
    (emit-proposal-executed-event proposal-id (get proposer proposal) (get amount proposal))
    
    (ok true)
  )
)

;; Reclaim vote costs after proposal ends
(define-public (reclaim-vote-cost (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) ERR-PROPOSAL-NOT-FOUND))
      (vote-data (unwrap! (map-get? votes { proposal-id: proposal-id, voter: tx-sender }) ERR-NOT-AUTHORIZED))
      (current-vote-costs (default-to { total-cost: u0 } (map-get? vote-costs { staker: tx-sender })))
    )
    ;; Can only reclaim after voting ends
    (asserts! (> stacks-block-height (get voting-ends-at proposal)) ERR-VOTING-PERIOD-ACTIVE)
    
    ;; Reduce vote cost tracking
    (map-set vote-costs
      { staker: tx-sender }
      { total-cost: (- (get total-cost current-vote-costs) (get cost-paid vote-data)) }
    )
    
    (ok true)
  )
)
