;; DAO: Ecosystem DAO
;; Title: EDP015 Activation of SIP-015
;; Author: Mike Cohen
;; Synopsis: Vote to Activate SIP-015 - the Stacks 2.1 Upgrade.
;; Description:
;; Vote yes to support activation of the Stacks 2.1 Upgrade.
;;
;; A post about the Staks 2.1 Upgrade can be found here,
;; https://stacks.org/stacks-21-what-to-expect. 
;; 
;; The vote requires 80% majority in favour to pass.

(impl-trait 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY.proposal-trait.proposal-trait)

(define-public (execute (sender principal))
	(ok true)
)
