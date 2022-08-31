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
if (!proposal) throw new Error('Proposal not found? ' + contractId);
const fundingCost = Number($settings.daoProperties?.find((o) => o.id === 'funding-cost')?.value) / 1000000 || 0;
const fundingMet = proposal.funding >= fundingCost;
const balance = $settings?.accountInfo?.balance;
const stacksTipHeight = $settings.info.stacks_tip_height;
let proposalDuration = Number($settings.daoProperties?.find((o) => o.id === 'proposal-duration')?.value) || 100;
let proposalStartDelay = Number($settings.daoProperties?.find((o) => o.id === 'proposal-start-delay')?.value) || 100;
const startHeightMessage = 'The earliest start for voting is ' + ((proposalStartDelay) / 144).toFixed(2) + ' days after proposal is funded at block ~ ' + (stacksTipHeight + proposalStartDelay);
const durationMessage = 'The voting window is ' + (proposalDuration)+ ' blocks, roughly ' + ((proposalDuration) / 144).toFixed(2) + ' days, after voting starts.';

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
let txId: string;

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
			txId = data.txId
			proposal.submitTxId = data.txId
			const resp = await ChainUtils.postToApi('/v2/proposals', proposal)
			console.log(resp)
		},
		onCancel: () => {
			console.log('popup closed!');
		}
    });
}
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
</script>

<section>
    <div class="">
		{#if !fundingMet}
			<p>{fundingCost - proposal.funding} STX is needed to fund this proposal - minimum contribution is 1 STX!</p>
			{#if txId}
				<div>
					<a href={explorerUrl} target="_blank">View on explorer</a>
				</div>
			{/if}
			<form on:submit|preventDefault class="form-inline">
				<div class="row">
					<div class="col-md-6">
						<input class="form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution">
					</div>
					<div class="col-md-4">
						<button class="btn outline-light" on:click={() => submit()}>Fund</button>
					</div>
				</div>
			</form>
			<p>Your current balance is {balance} STX</p>
			<div class="my-4 card bg-light p-4">
				<p>{startHeightMessage}</p>
				<p>{durationMessage}</p>
			</div>
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
