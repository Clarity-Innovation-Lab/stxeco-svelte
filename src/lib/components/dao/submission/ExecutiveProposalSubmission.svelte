<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
	import { client } from '$lib/micro-stacks-client';
	import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
	import { PostConditionMode } from 'micro-stacks/transactions';
	import { TxType } from '@micro-stacks/client';

	let contractId = $page.params.contractId
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);

	const stacksTipHeight = $settings.info.stacks_tip_height;

	const submit = async () => {
        const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1])
		let functionArgs = [proposalCV]
		const txOptions = {
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: import.meta.env.VITE_DAO_DEPLOY_ADDRESS,
			contractName: 'ede004-emergency-proposals',
			functionName: 'emergency-propose',
			functionArgs: functionArgs,
			// network,
			appDetails: {
				name: 'Ecosystem DAO',
				icon: '/img/logo.png'
			},
			onCancel: (error: any) => {
				console.log(error)
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

	const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
	{#if executiveTeamMember}
	<div class="my-5">
		<button class="btn outline-light mr-2 text-info" on:click={() => submit()}>Emergency Proposal</button>
		<p class="text-small">Submit this contract as an emergency proposal - voting ends at block {stacksTipHeight + 144}.</p>
	</div>
	{/if}
</section>

<style>
</style>
