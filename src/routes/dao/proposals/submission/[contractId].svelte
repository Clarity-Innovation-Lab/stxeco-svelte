<script lang="ts">
	import { page } from '$app/stores';
	import EmergencyExecuteSubmission from '$lib/components/dao/submission/EmergencyExecuteSubmission.svelte'
	import ExecutiveProposalSubmission from '$lib/components/dao/submission/ExecutiveProposalSubmission.svelte'
	import FundedSubmissionVoting from '$lib/components/dao/submission/FundedSubmissionVoting.svelte'
	import ThresholdSubmissionVoting from '$lib/components/dao/submission/ThresholdSubmissionVoting.svelte'
	import { ChevronDoubleLeft } from "svelte-bootstrap-icons";
	import settings from '$lib/settings';
	import ExecutedBanner from '$lib/components/dao/proposals/ExecutedBanner.svelte'

	let contractId = $page.params.contractId
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
    const proposalContractUrl = (proposal.contract.tx_id) ? import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK : null

	const executed = proposal.executedAt > 0
	
	const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false

	const thresholdProposalExt = $settings.extensions.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede002-threshold-proposal-submission') > 0);
  	const thresholdProposal = thresholdProposalExt && thresholdProposalExt.valid;

	const fundedProposalExt = $settings.extensions.find((o: { contract: { contract_id: string|string[]; }; }) => o.contract.contract_id.indexOf('ede008-funded-proposal-submission') > 0);
  	const fundedProposal = fundedProposalExt && fundedProposalExt.valid;

	let showExecutiveProposal = false;
	let showThresholdProposal = false;
	let showFundedProposal = false;
	let showEmergencyExecute = false;
	const showFundedForm = () => {
		showFundedProposal = !showFundedProposal;
		showThresholdProposal = false;
		showExecutiveProposal = false;
		showEmergencyExecute = false;
	}
	const showThresholdForm = () => {
		showThresholdProposal = !showThresholdProposal;
		showExecutiveProposal = false;
		showFundedProposal = false;
		showEmergencyExecute = false;
	}
	const showExecutiveProposalSubmitForm = () => {
		showExecutiveProposal = !showExecutiveProposal;
		showThresholdProposal = false;
		showFundedProposal = false;
		showEmergencyExecute = false;
	}
	const showEmergencySubmitForm = () => {
		showEmergencyExecute = !showEmergencyExecute;
		showThresholdProposal = false;
		showFundedProposal = false;
		showExecutiveProposal = false;
	}
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="container my-5">
		<div class="d-flex justify-content-between">
			<h4>Submit Proposal: <span class="text-warning">{ proposal.title }</span></h4>
			<div>
				<a href="/dao/proposals"><ChevronDoubleLeft/> back</a>
			</div>
		</div>
		<div class="d-flex justify-content-center mb-5">
			<div class="card  p-4 bg-light w-100">
				<ol>
					<li>
					Please ensure the proposal contract is deployed and implements proposal trait
					{#if proposalContractUrl}
					<ul>
						<li>
							<a href={proposalContractUrl} target="_blank">{ proposal.contractId }</a>
						</li>
					</ul>
					{/if}
					</li>
					<li>The proposal contract is safe to run and will not fail to execute if passed by the community.</li>
					<li>The comments in the contract accurately reflect the proposal.</li>
				</ol>
			</div>
		</div>
		<div class="text-center my-5">
			{#if !executed}
			<div class="text-center my-5">
				{#if fundedProposal}
					<button class:text-success={showFundedProposal} class="btn outline-light mr-2" on:click={showFundedForm}>Submit Funded Proposal</button>
				{/if}
				{#if thresholdProposal}
					<button class:text-success={showThresholdProposal} class="btn outline-light mr-2" on:click={showThresholdForm}>Submit Threshold Proposal</button>
				{/if}
				{#if executiveTeamMember}
					<button class:text-success={showExecutiveProposal} class="btn outline-light mr-2" on:click={showExecutiveProposalSubmitForm}>Submit Executive Proposal</button>
				{/if}
				{#if executiveTeamMember}
					<button class:text-success={showEmergencyExecute} class="btn outline-light mr-2" on:click={showEmergencySubmitForm}>Submit Emergency Execute</button>
				{/if}
			</div>
			{:else}
			<ExecutedBanner {proposal} />
			{/if}
		</div>
		{#if showFundedProposal}
			<div class="jumbo">
				<FundedSubmissionVoting/>
			</div>
		{/if}
		{#if showThresholdProposal}
			<div class="jumbo">
				<ThresholdSubmissionVoting/>
			</div>
		{/if}
		{#if showExecutiveProposal}
			<div class="jumbo">
				<ExecutiveProposalSubmission/>
			</div>
		{/if}
		{#if showEmergencyExecute}
			<div class="jumbo">
				<EmergencyExecuteSubmission/>
			</div>
		{/if}
		
	</div>
</section>

<style>
</style>