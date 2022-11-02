;; DAO: Ecosystem DAO
;; Title: EDP011 Enable Custom Majority
;; Author: Mike Cohen
;; Synopsis: Enables setting a custom majority per proposal
;; Description:
;; This proposal will replace extensions 007 and 008 which currently provide
;; proposal submission and voting with new versions which also allow custom
;; majority to be set per by the funding transaction. Details of the code changes can be found here
;; https://github.com/Clarity-Innovation-Lab/ecosystem-dao/tree/feat/dynamic-majority

(impl-trait 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY.proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(begin
		(try! (contract-call? .executor-dao set-extensions
			(list
				{extension: .ede007-snapshot-proposal-voting, enabled: false}
				{extension: .ede008-funded-proposal-submission, enabled: false}
				{extension: .ede007-snapshot-proposal-voting-v3, enabled: true}
				{extension: .ede008-funded-proposal-submission-v3, enabled: true}
			)
		))
		(ok true)
	)
)
