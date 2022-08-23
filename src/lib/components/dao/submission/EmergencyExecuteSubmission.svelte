<script lang="ts">
	import { page } from '$app/stores';
	import settings from '$lib/settings';
  import { contractPrincipalCV } from 'micro-stacks/clarity';
  import { PostConditionMode } from 'micro-stacks/transactions';
  import { getOpenContractCall } from '@micro-stacks/svelte';

  const contractCall = getOpenContractCall();

	let contractId = $page.params.contractId;
	export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
	if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
  const proposalData = proposal.proposalData || { startBlockHeight: 0, endBlockHeight: 0, proposer: '' }

  const signalSupport = async () => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    await $contractCall.openContractCall({
      postConditions: [],
      postConditionMode: PostConditionMode.Deny,
      contractAddress: deployer,
      contractName: 'ede004-emergency-execute',
      functionName: 'executive-action',
      functionArgs: [proposalCV],
      onFinish: data => {
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  }

	let stacksTipHeight = $settings.info.stacks_tip_height;
  const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
  const canVote = executiveTeamMember // && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
</script>

<section>
  {#if canVote}
  <div class="row mt-5">
    <div class="my-5 text-center">
		<h4>{proposal.contractId.split('.')[1]}</h4>
		<h6>Signal support for this proposal via multisig voting by executive team</h6>
      <button class="btn btn-outline-success" on:click={() => signalSupport()}>SUPPORT</button>
    </div>
  </div>
  {/if}
</section>

<style>
</style>
