<script context="module">
import CallButtons1 from '$lib/shared/CallButtons1.svelte'

  /** @type {import('./$types').RequestHandler} */
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
import EmergencyExecuted from '$lib/components/dao/proposals/EmergencyExecuted.svelte'
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
import DaoUtils from '$lib/service/DaoUtils';

const account = getAccount();

export let proposal:ProposalType;
export let contractId:string;

const stacksTipHeight = $settings.info?.stacks_tip_height || 0;
proposal.status = DaoUtils.getStatus(stacksTipHeight, proposal);
const propStatus = proposal.status.name;

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

const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
const thresholdProposalExt = $settings.extensions?.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede002-threshold-proposal-submission') > 0);
const thresholdProposalsValid = thresholdProposalExt && thresholdProposalExt.valid;
const fundedProposalExt = $settings.extensions?.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede008-funded-proposal-submission-v2') > 0);
const fundedProposalsValid = fundedProposalExt && fundedProposalExt.valid;
const executiveProposalsValid = false;
const emergencyProposalsValid = true;

$: balanceAtHeight = 0
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK;
const color = proposal.status.color;

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
    <div class="blog-modal"><DaoRules /></div>
  {/if}
    <div slot="title">
      {#if showSourceModal}
      <h3>Proposal: {proposal.contract.contract_id?.split('.')[1]}</h3>
      {/if}
    </div>
</Modal>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
  <div class="row">
    {#if proposal?.status?.name === 'funding'}
      <div class="cols-12"><h1 class={'text-' + color}><span class={'strokeme-' + color}>Crowd Fund</span><br/>{ proposal.title }</h1></div>
      <div class="cols-12"><p class="strapline">Use your voice to participate in key decision making processes<br/>
        and take this proposal to a vote.</p></div>
    {:else}
      <div class="cols-12"><h1 class={'text-' + color}><span class={'strokeme-' + color}>Proposal</span><br/>{ proposal.title }</h1></div>
      <div class="cols-12"><p class="strapline">Use your voice to participate in key decision making processes to bring about change<br/>
        and improvements to the Stacks Network.</p></div>
    {/if}
  </div>
  <div class="row">
    <div class="cols-12 text-end my-3">
      <p class="w-100 text-right">
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { goto(`/dao/forum/${contractId}`) }}>forum</button>
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { goto(`/dao/voting/${contractId}`) }}>voting</button>
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { openSourceModal() }}>clarity</button>
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { openRulesModal() }}>about</button>
        <a class={'btn btn-outline-' + color} href={explorerUrl} target="_blank">explorer</a>
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { goto(`/dao/proposals`) }}>back</button>
      </p>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 col-sm-12 mb-4">
      <div class="bg-card p-3"><Preamble {proposal}/></div>
    </div>
    <div class="col-md-6 col-sm-12">
      <div>
      {#if emergencyProposalsValid && executiveTeamMember && propStatus === 'deployed'}
        <div class="mb-3 ">
          <EmergencyExecuteSubmission/>
        </div>
      {/if}
      {#if propStatus === 'emergexec'}
        <EmergencyExecuted {proposal} />
      {:else if propStatus === 'commencing soon' ||  propStatus === 'failed' ||  propStatus === 'passed' ||  propStatus === 'concluded' || propStatus === 'voting ended' || propStatus === 'voting'}
        {#if proposal.proposalData && proposal.votingContract === 'ede001-proposal-voting'}
          <VotingSchedule {proposal}/>
          <PropBallotBox {proposal} />
        {:else if proposal.proposalData && proposal.votingContract === 'ede007-snapshot-proposal-voting-v2'}
          <VotingSchedule {proposal}/>
          <SnapBallotBox {proposal} {balanceAtHeight}/>
        {/if}
      {:else if propStatus === 'funding'}
          <FundedSubmissionVoting/>
      {:else if propStatus === 'deployed' || propStatus === 'deploying' || propStatus === 'submitted' || propStatus === 'submitting' }
        <div class="">
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
        </div>
        {/if}
      </div>
    </div>
  </div>
  <p class="my-5 text-center">
    <CallButtons1 />
  </p>
</section>

<style>
section {
  font-family: Gilroy-Light;
}
</style>
