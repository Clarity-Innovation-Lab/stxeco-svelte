<script lang="ts">
	import { page } from '$app/stores';
	import { ChevronDoubleLeft } from "svelte-bootstrap-icons";
	import settings from '$lib/settings';
	import StacksAuthStore from '../../../../stores/StacksAuthStore'
	import RangeSlider from "svelte-range-slider-pips";
	import { client } from '$lib/micro-stacks-client';
	import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
	import { PostConditionMode } from 'micro-stacks/transactions';
	import { TxType } from '@micro-stacks/client';

	let contractId = $page.params.contractId
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);

	const stacksTipHeight = $settings.info.stacks_tip_height;
    const proposalContractUrl = (proposal.contract.tx_id) ? import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK : null
	let obj = $settings.daoProperties?.find((o) => o.id === 'minimum-proposal-start-delay');
  	const minStartHeight = Number(obj?.value) + 1 || 0;
	obj = $settings.daoProperties?.find((o) => o.id === 'maximum-proposal-start-delay');
  	const maxStartHeight = Number(obj?.value) || 100;
	const startHeightMessage = 'Currently at block ' + stacksTipHeight + '. Earliest start for voting is block ' + (stacksTipHeight + minStartHeight) + ' ~ ' + (minStartHeight / 144).toFixed(2) + ' days and latest is ' + (stacksTipHeight + maxStartHeight) + ' ~ ' + (maxStartHeight / 144).toFixed(2) + ' days.';

	let propStart = minStartHeight + stacksTipHeight+ 1
	$: startHeight = [minStartHeight + stacksTipHeight+ 1];
	const changeToken = (choice: { detail: { value: number; }; }) => {
      startHeight = [choice.detail.value]
	  propStart = startHeight
    }
	const submit = async (emergency:boolean) => {
		if (!emergency) console.log('normal')
		proposal.startHeight = propStart
        const startHeight = uintCV(propStart)
        const governanceCV = contractPrincipalCV(import.meta.env.VITE_DAO_DEPLOY_ADDRESS, 'ede000-governance-token')
        const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
		let functionArgs = []
		if (emergency) {
			functionArgs = [proposalCV]
		} else {
			functionArgs = [proposalCV, startHeight, governanceCV]
		}
		const txOptions = {
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
			contractName: (emergency) ? 'ede003-emergency-proposals' : 'ede002-proposal-submission',
			functionName: (emergency) ? 'emergency-propose' : 'propose',
			functionArgs: functionArgs,
			// network,
			appDetails: {
				name: 'Ecosystem DAO',
				icon: '/img/logo.png'
			},
			onCancel: (error: any) => {
				console.error(error)
			},
			onFinish: (result: { txId: string; txRaw: any; stacksTransaction: any; }) => {
				proposal.status = 'submitting'
				proposal.submitTxId = result.txId
				let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposals';
				postData(url, proposal)
			}
		}
		client.signTransaction(TxType.ContractCall, txOptions);
	}
	const postData = async (url:string, data:any) => {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		return response.json(); 
	}

	const emergencia = import.meta.env.VITE_DAO_EMERGENCY_TEAM;
	const executiveTeam = emergencia.indexOf($StacksAuthStore.stxAddress) > -1;
	const percentageBal = $settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance');
	const canSubmit = percentageBal?.value.value || false;
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
		{#if executiveTeam}
		<div class="text-center my-5">
			<div class="text-center my-5">
				<button class="btn outline-light mr-2 text-info" on:click={() => submit(true)}>Emergency Proposal</button>
				<p class="text-small">Submit this contract as an emergency proposal - voting ends at block {stacksTipHeight + 144}.</p>
			</div>
		</div>
		{/if}
		<div>
			<label for="status-name">{startHeightMessage}</label>
			<div class="w-100">
				<RangeSlider pips float bind:values={startHeight} min={minStartHeight + stacksTipHeight + 1} max={maxStartHeight + stacksTipHeight} on:change={changeToken} />
			</div>
			<div class="w-100 d-flex justify-content-between">
				<div class="sl-2 text-warning">
					<span type="button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title={startHeightMessage}>earliest</span>
				</div>
				<div class="sr-2 text-warning">
					<span type="button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" title={startHeightMessage}>latest</span>
				</div>
			</div>
			<div class="py-3 w-100">
				<label for="status-name">Voting starts at block { (Number(startHeight[0])) } ~ { (startHeight[0] / 144).toFixed(2) } days.</label>
			</div>
		</div>
		<div>
			{#if canSubmit}
			<button class="btn outline-light mr-2 text-info" on:click={() => submit(false)}>Submit Proposal</button>
			{:else}
			Unable to submit proposals
			{/if}
		</div>
	</div>
</section>

<style>
</style>
