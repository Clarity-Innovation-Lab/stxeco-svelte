<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { FungibleConditionCode, PostConditionMode, makeStandardSTXPostCondition } from 'micro-stacks/transactions';
import ChainUtils from '$lib/service/ChainUtils';
import { getNotificationsContext } from 'svelte-notifications';
import { getAccount } from '@micro-stacks/svelte';
import { getOpenContractCall } from '@micro-stacks/svelte';

const contractCall = getOpenContractCall();

const account = getAccount();

const { addNotification } = getNotificationsContext();

let contractId = $page.params.contractId
export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
const fundingCost = Number($settings.daoProperties?.find((o) => o.id === 'funding-cost')?.value) / 1000000 || 0;
const fundingMet = proposal.funding < fundingCost;
const balance = $settings.accountInfo.balance;
const stacksTipHeight = $settings.info.stacks_tip_height;
let proposalDuration = Number($settings.daoProperties?.find((o) => o.id === 'proposal-duration')?.value) || 100;
let proposalStartDelay = Number($settings.daoProperties?.find((o) => o.id === 'proposal-start-delay')?.value) || 100;
const startHeightMessage = 'Block height ' + stacksTipHeight + '. Earliest start for voting is block ' + (stacksTipHeight + proposalStartDelay)+ ' (about ' + ((proposalStartDelay) / 144).toFixed(2) + ' days) after proposal is funded.';
const durationMessage = 'Voting will continue for ' + (proposalDuration)+ ' blocks (about ' + ((proposalDuration) / 144).toFixed(2) + ' days) after voting starts.';

const getSTXMintPostConds = function (amt:number) {
	const postConds = []
	if (!$account.stxAddress) return [];
	const amount = amt; // ChainUtils.toOnChainAmount(amt, 0)
	postConds.push(makeStandardSTXPostCondition(
		$account.stxAddress,
		FungibleConditionCode.LessEqual,
		amount
	))
	return postConds
}

let amount = 1;
const submit = async () => {
	if (amount < 1) {
		addNotification({
			position: 'bottom-right',
			heading: 'Please fix',
			type: 'error',
			description: 'Minimum contribution is 1 STX',
		});
		return
	}
	const amountUSTX = ChainUtils.toOnChainAmount(amount)
	const amountCV = uintCV(amountUSTX)
	const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
	let functionArgs = [proposalCV, amountCV];
	await $contractCall.openContractCall({
		postConditions: getSTXMintPostConds(amountUSTX),
		postConditionMode: PostConditionMode.Deny,
		contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
		contractName: 'ede008-funded-proposal-submission',
		functionName: 'fund',
		functionArgs: functionArgs,
		onFinish: async (data) => {
			proposal.status = 'submitting'
			proposal.submitTxId = data.txId
			const resp = await ChainUtils.postToApi('/v2/proposals', proposal)
			console.log(resp)
		},
		onCancel: () => {
			console.log('popup closed!');
		}
    });
}
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="container my-5">
	{#if fundingMet}
		<p>Funding target is {fundingCost} STX</p>
		<p>Currently funded {proposal.funding} STX</p>
		<p>Your wallet balance is {balance} STX</p>
		<div class="my-4 card bg-light p-4 text-center">
			<p>{startHeightMessage}</p>
			<p>{durationMessage}</p>
		</div>
		<form on:submit|preventDefault>
			<div class="mb-3 text-center">
				<label for="Contribution" class="form-label">Contribution STX</label>
				<div class="d-flex justify-content-center"><input class="w-25 form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"> </div>
				<div id="emailHelp" class="form-text">The amount you wish to contribute towards funding this proposal - minimum contribution is 1 STX.</div>
			  </div>
			<button class="btn outline-light mr-2 text-info" on:click={() => submit()}>Fund Proposal</button>
		</form>
	{:else}
		<p>Funding target met {proposal.funding} of {fundingCost} STX raised</p>
		<div class="my-4 card bg-light p-4 text-center">
			<p>{startHeightMessage}</p>
			<p>{durationMessage}</p>
		</div>
	{/if}
	</div>
</section>

<style>
</style>
