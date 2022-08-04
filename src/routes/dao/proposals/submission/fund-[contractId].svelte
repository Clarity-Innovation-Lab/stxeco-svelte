<script lang="ts">
	import { page } from '$app/stores';
	import FundedSubmissionVoting from '$lib/components/dao/submission/FundedSubmissionVoting.svelte'
	import { ChevronDoubleLeft } from "svelte-bootstrap-icons";
	import settings from '$lib/settings';

	let contractId = $page.params.contractId
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
    const proposalContractUrl = (proposal.contract.tx_id) ? import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + proposal.deployTxId + '?chain=' + import.meta.env.VITE_NETWORK : null

</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
    <div class="container my-5">
		<div class="d-flex justify-content-between">
			<h4>Fund Proposal: <span class="text-warning">{ proposal.title }</span></h4>
			<div>
				<a href="/dao/proposals"><ChevronDoubleLeft/> back</a>
			</div>
		</div>
		<div class="jumbo">
			<FundedSubmissionVoting/>
		</div>

	</div>
</section>

<style>
</style>
