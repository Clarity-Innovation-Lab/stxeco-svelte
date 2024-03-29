<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import RangeSlider from "svelte-range-slider-pips";
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { getOpenContractCall } from '@micro-stacks/svelte';

const contractCall = getOpenContractCall();

let contractId = $page.params.contractId
export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);

const stacksTipHeight = $settings.info.stacks_tip_height;
let minStartHeight = Number($settings.daoProperties?.find((o) => o.id === 'minimum-proposal-start-delay')?.value) + 1 || 0;
let maxStartHeight = Number($settings.daoProperties?.find((o) => o.id === 'maximum-proposal-start-delay')?.value) || 100;
const startHeightMessage = 'Currently at block ' + stacksTipHeight + '. Earliest start for voting is block ' + (stacksTipHeight + minStartHeight) + ' ~ ' + (minStartHeight / 144).toFixed(2) + ' days and latest is ' + (stacksTipHeight + maxStartHeight) + ' ~ ' + (maxStartHeight / 144).toFixed(2) + ' days.';

let propStart = minStartHeight + stacksTipHeight+ 1
$: startHeight = [minStartHeight + stacksTipHeight+ 1];
const changeToken = (choice: { detail: { value: number; }; }) => {
	startHeight = [choice.detail.value]
	propStart = startHeight
}
const submit = async () => {
	proposal.startHeight = propStart
	const startHeight = uintCV(propStart)
	const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
	let functionArgs = [proposalCV, startHeight]
	await $contractCall.openContractCall({
		postConditions: [],
		postConditionMode: PostConditionMode.Deny,
		contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
		contractName: 'ede002-threshold-proposal-submission',
		functionName: 'propose',
		functionArgs: functionArgs,
		onFinish: data => {
			proposal.status = {name: 'submitting'};
			proposal.submitTxId = data.txId
			let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposals';
			postData(url, proposal)
		},
		onCancel: () => {
			console.log('popup closed!');
		},
    });
}
const postData = async (url:string, data:any) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
	return response.json(); 
}

const percentageBal = $settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance');
const canSubmit = percentageBal?.value.value || false;
</script>

<section>
    <div class="container my-5">
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
			<button class="btn outline-light mr-2 text-info" on:click={() => submit()}>Submit Threshold Proposal</button>
			{:else}
			Unable to submit proposals
			{/if}
		</div>
	</div>
</section>

<style>
</style>
