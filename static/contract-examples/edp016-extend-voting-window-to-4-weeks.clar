;; DAO: Ecosystem DAO
;; Title: EDP014 Extend Voting Window
;; Author: Clarity Lab
;; Synopsis: Change DAO parameters for testing SIP activation voting.
;; Description:
;; This proposal sets the voting window to 4032 block (4 weeks) for DAO testing. 

(impl-trait 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z.proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .ede008-funded-proposal-submission-v3 set-parameter "proposal-duration" u4032))
		(ok true)
	)
)
