;; DAO: Ecosystem DAO
;; Title: EDP011 Enable Snapshot Voting
;; Author: Mike Cohen
;; Synopsis:
;; This proposal disables extensions and sets the emergency signals required to 1
;; Description:
;; Proposal for use on dev net.

(impl-trait .proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		;; Enable genesis extensions.
		(try! (contract-call? .executor-dao set-extensions
			(list
				{extension: .ede007-snapshot-proposal-voting, enabled: true}
				{extension: .ede008-funded-proposal-submission, enabled: true}
			)
		))
		(try! (contract-call? .ede008-funded-proposal-submission set-parameter "funding-cost" u10000000))
		(try! (contract-call? .ede008-funded-proposal-submission set-parameter "proposal-start-delay" u2))
		(try! (contract-call? .ede008-funded-proposal-submission set-parameter "proposal-duration" u200))
		(ok true)
	)
)
