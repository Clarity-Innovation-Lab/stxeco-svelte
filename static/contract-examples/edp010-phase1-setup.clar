;; DAO: Ecosystem DAO
;; Title: EDP002 Kill Emergency Execute
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
				{extension: .ede000-governance-token, enabled: false}
				{extension: .ede001-proposal-voting, enabled: false}
				{extension: .ede002-threshold-proposal-submission, enabled: false}
				{extension: .ede003-emergency-proposals, enabled: false}
				{extension: .ede004-emergency-execute, enabled: true}
				{extension: .ede006-treasury, enabled: true}
			)
		))
		(try! (contract-call? .ede004-emergency-execute set-signals-required u2))
		(ok true)
	)
)
