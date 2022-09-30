<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import { contractPrincipalCV, uintCV, someCV } from 'micro-stacks/clarity';
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
const color = proposal.status.color;

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
	const thresholdCV = someCV(uintCV(8000));
	const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
	let functionArgs = [proposalCV, amountCV, thresholdCV];
	await $contractCall.openContractCall({
		postConditions: getSTXMintPostConds(amountUSTX),
		postConditionMode: PostConditionMode.Deny,
		contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
		contractName: 'ede008-funded-proposal-submission-v2',
		functionName: 'fund',
		functionArgs: functionArgs,
		onFinish: async (data) => {
			proposal.status = { name: 'submitting', color: '', colorCode: '' },
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
{#if !fundingMet}
	<div class="bg-card p-5 text-white">
		<h5 class="upper" style="position: relative; top: 0px; left: 0px;" >
			<img style="position: relative; top: -20px; left: 0px;" src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="15px" height="auto" />
			{fundingCost - proposal.funding} STX needed!
		</h5>
		<div style="margin-left: 20px;">
			<p class="sub-text">(minimum contribution is 1 STX)</p>
			{#if txId}
				<div>
					<a href={explorerUrl} target="_blank">View on explorer</a>
				</div>
			{/if}
			<form on:submit|preventDefault class="form-inline">
				<div class="row">
					<div class="col-10">
						<input class={'bg-card form-control border-' + color} bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution">
					</div>
					<div class="col-2 p-0">
						<button class={'btn btn-' + color} on:click={() => submit()}>Fund</button>
					</div>
				</div>
			</form>
			<p class="sub-text">Your current balance is {balance} STX</p>
		</div>
	</div>
	<div class="bg-card py-4 px-5 mt-3" >
		<div class="">
			<p>{startHeightMessage}</p>
			<p>{durationMessage}</p>
		</div>
	</div>
{:else}
	<div class="bg-card">
		<p>Funding target met {proposal.funding} of {fundingCost} STX raised</p>
		<div class="my-4 card bg-light p-4 text-center">
			<p>{startHeightMessage}</p>
			<p>{durationMessage}</p>
		</div>
	</div>
{/if}
</section>

<style>
p {
	font-family: Gilroy-Light;
	color: #ededed;
	padding: 3px;
	margin: 0 !important;
	font-size: 1.0rem;
	text-transform: lowercase;
}
.sub-text {
	font-size: 0.8rem;
}
</style>
