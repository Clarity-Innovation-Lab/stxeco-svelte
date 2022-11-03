;; DAO: Ecosystem DAO
;; Title: EDP014 Extend Voting Window
;; Author: Mike Cohen
;; Synopsis: Change DAO parameters for testing SIP activation voting.
;; Description:
;; This proposal sets the delay before voting starts, the voting window and 
;; the funding cost to values appropriate to test SIP activation voting. 

(impl-trait 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY.proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .ede008-funded-proposal-submission-v2 set-parameter "funding-cost" u100000000))
		(try! (contract-call? .ede008-funded-proposal-submission-v2 set-parameter "proposal-start-delay" u72)) ;; ~ 12 hours day
		(try! (contract-call? .ede008-funded-proposal-submission-v2 set-parameter "proposal-duration" u360))  ;; 2.5 days
		(ok true)
	)
)
