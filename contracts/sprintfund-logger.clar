;; SprintFund Activity Logger - For generating on-chain transactions
(define-data-var activity-count uint u0)

(define-map activities
  uint
  {
    caller: principal,
    message: (string-utf8 100),
    timestamp: uint
  }
)

(define-public (log-activity (message (string-utf8 100)))
  (let ((activity-id (var-get activity-count)))
    (map-set activities activity-id {
      caller: tx-sender,
      message: message,
      timestamp: block-height
    })
    (var-set activity-count (+ activity-id u1))
    (ok activity-id)
  )
)

(define-read-only (get-activity (activity-id uint))
  (map-get? activities activity-id)
)

(define-read-only (get-activity-count)
  (ok (var-get activity-count))
)
