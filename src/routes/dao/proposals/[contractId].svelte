<script context="module">
export async function load({ params, fetch }) {
  try {
    const contractId = params.contractId;
    let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposal/' + contractId;
    let res = await fetch(url);
    if (res.ok) {
        const proposal = await res.json();
				return {
					props: {
            contractId,
            proposal
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch issues')
				}
			}
  } catch (e) {
    // console.log(e);
  }
}
</script>

<script lang="ts">
import settings from '$lib/settings';
import ChainUtils from '$lib/service/ChainUtils';
import {onMount} from 'svelte'
import VotingSchedule from '$lib/components/dao/voting/VotingSchedule.svelte'
import PropBallotBox from '$lib/components/dao/voting/PropVotingBallotBox.svelte'
import SnapBallotBox from '$lib/components/dao/voting/SnapVotingBallotBox.svelte'
import { goto } from '$app/navigation';
import ExecutedBanner from '$lib/components/dao/proposals/ExecutedBanner.svelte'
import { getAccount } from '@micro-stacks/svelte';
import Modal from '$lib/shared/Modal.svelte';
import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
import DaoRules from '$lib/components/dao/proposals/DaoRules.svelte';
import type { ProposalType } from "../../../types/stxeco.type";
import FundedSubmissionVoting from '$lib/components/dao/submission/FundedSubmissionVoting.svelte'
import ThresholdSubmissionVoting from '$lib/components/dao/submission/ThresholdSubmissionVoting.svelte'
import EmergencyExecuteSubmission from '$lib/components/dao/submission/EmergencyExecuteSubmission.svelte'
import ExecutiveProposalSubmission from '$lib/components/dao/submission/ExecutiveProposalSubmission.svelte'
import Preamble from '$lib/components/dao/proposals/Preamble.svelte'

const account = getAccount();

export let proposal:ProposalType;
export let contractId:string;

// export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal || proposal.contract.tx_status === 'failed') {
  goto(`/dao/proposals/404?contractId=${contractId}`, { replaceState: false })
}
const sourceCode: string|undefined = proposal.contract.source_code;
let showSourceModal:boolean;
let showRulesModal:boolean;
const openSourceModal = () => {
  showSourceModal = true;
  showRulesModal = false;
}
const openRulesModal = () => {
  showSourceModal = false;
  showRulesModal = true;
}
const closeModal = () => {
  showSourceModal = false;
  showRulesModal = false;
}

let propStatus = 'unknown';
if (typeof (proposal.executedAt) === 'number' && proposal.executedAt > 0) {
  propStatus = 'executed';
} else if (proposal.deployTxId && !proposal.proposalData && proposal.contract.tx_status === 'pending') {
  propStatus = 'deploying';
} else if (proposal.deployTxId && !proposal.proposalData && proposal.votingContract === 'ede007-snapshot-proposal-voting') {
  propStatus = 'readyToFund';
} else if (proposal.deployTxId && !proposal.proposalData && proposal.votingContract !== 'ede007-snapshot-proposal-voting') {
  propStatus = 'readyToSubmit';
} else if (proposal.proposalData && proposal.votingContract === 'ede001-proposal-voting') {
  propStatus = 'readyToVoteViaGovernanceToken';
} else if (proposal.proposalData && proposal.votingContract === 'ede007-snapshot-proposal-voting') {
  propStatus = 'readyToVoteViaSnapshot';
} else if (!proposal.proposalData && !proposal.submitTxId && proposal.deployTxId) {
  propStatus = 'readyToSubmit';
}

const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
const thresholdProposalExt = $settings.extensions.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede002-threshold-proposal-submission') > 0);
const thresholdProposalsValid = thresholdProposalExt && thresholdProposalExt.valid;
const fundedProposalExt = $settings.extensions.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede008-funded-proposal-submission') > 0);
const fundedProposalsValid = fundedProposalExt && fundedProposalExt.valid;
const executiveProposalsValid = false;
const emergencyProposalsValid = true;

$: balanceAtHeight = 0
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK;

onMount(async () => {
  if (proposal.proposalData) {
    try {
      const callData = {
        path: '/extended/v1/address/' + $account.stxAddress + '/balances?until_block=' + proposal.proposalData?.startBlockHeight,
        httpMethod: 'get'
      }
      const response = await ChainUtils.postToApi('/v2/accounts', callData);
      balanceAtHeight = ChainUtils.fromMicroAmount(response.stx.balance)
    } catch (e) {
      balanceAtHeight = 0;
      console.log(e)
    }
  }
})
</script>

<Modal showModal={showSourceModal || showRulesModal} on:click={closeModal}>
  {#if showSourceModal}
    <div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
  {:else}
    <div class="source-modal"><DaoRules /></div>
  {/if}
    <div slot="title">
      {#if showSourceModal}
      <h3>Proposal: {proposal.contract.contract_id?.split('.')[1]}</h3>
      {:else}
        <h3>DAO Rules</h3>
      {/if}
    </div>
</Modal>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="my-2">
      <div class="border-bottom pb-2 mb-5 w-100 d-flex justify-content-between text-small">
        <h4>Proposal: <span class="">{ proposal.title }</span></h4>
        <div>
          <a class="mx-3" href="/" on:click|preventDefault={() => { openSourceModal() }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Show source code">Show Clarity</a>
          <a class="mx-3" href="/" on:click|preventDefault={() => { openRulesModal() }} data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Show rules">Show Rules</a>
          <a class="mx-3" href={explorerUrl} target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title="Show on blockchain explorer">Explorer</a>
          <a class="mx-3" href="/dao/proposals">Back</a>
        </div>
      </div>
    </div>
    
    {#if propStatus === 'executed'}
      <h1>Proposal Passed</h1>
      <ExecutedBanner {proposal} />
      <Preamble {proposal}/>
    {:else if propStatus === 'deploying'}
      <h1>Proposal Deploying</h1>
      <Preamble {proposal}/>
      <p>Contract deployment is pending - check explorer for updates...</p>
    {:else if propStatus === 'readyToFund'}
        <h1>Crowd Fund Proposal</h1>
        <p>Help take this proposal to a vote?</p>
        <Preamble {proposal}/>
				<FundedSubmissionVoting/>
    {:else if propStatus === 'readyToSubmit'}
      <div class="">
        <h1 class="my-3">Ready to Start Crowd Funding</h1>
        <Preamble {proposal}/>
        {#if fundedProposalsValid}
          <div class="">
            <FundedSubmissionVoting/>
          </div>
        {/if}
        {#if thresholdProposalsValid}
          <div class="">
            <ThresholdSubmissionVoting/>
          </div>
        {/if}
        {#if executiveProposalsValid && executiveTeamMember}
          <div class="">
            <ExecutiveProposalSubmission/>
          </div>
        {/if}
        {#if emergencyProposalsValid && executiveTeamMember}
          <h1 class="mt-5">Emergency Execute</h1>
          <p>Its possible to pass this proposal via a vote from the executive team</p>
          <div class="">
            <EmergencyExecuteSubmission/>
          </div>
        {/if}
      </div>
    {:else if propStatus === 'readyToVoteViaGovernanceToken'}
      <h1>Vote For/Against Proposal</h1>
      <p>Have your say on changes in the Stacks Eco-System</p>
      <Preamble {proposal}/>
      <VotingSchedule {proposal}/>
      <PropBallotBox {proposal} />
    {:else if propStatus === 'readyToVoteViaSnapshot' && balanceAtHeight > 0}
      <h1>Vote For/Against Proposal</h1>
      <p>Have your say on changes in the Stacks Eco-System</p>
      <Preamble {proposal}/>
      <VotingSchedule {proposal}/>
      <SnapBallotBox {proposal} {balanceAtHeight}/>
    {/if}
  </section>

<style>
</style>
