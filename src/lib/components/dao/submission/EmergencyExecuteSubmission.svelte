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
  const sigsRequired = Number($settings.daoProperties?.find((o) => o.id === 'get-signals-required')?.value) || 0;
  $: buttonLabel = $contractCall.isRequestPending ? "Tx Sent": "SUPPORT PROPOSAL";
  let txId: string;

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
        txId = data.txId;
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  }

  const executiveTeamMember = $settings.userProperties?.find((o) => o.functionName === 'is-executive-team-member')?.value?.value || false
  const canVote = executiveTeamMember // && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight
  $: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;
</script>

<section>
  {#if canVote}
  <div class="row">
    <div class="my-3">
      <h4>{proposal.contractId.split('.')[1]}</h4>
      <h6>Signal support for this proposal via multisig voting by executive team</h6>
      <p>{proposal.emergencySignals} of {sigsRequired} signal(s) received so far.</p>
      {#if !txId}<button class="btn btn-outline-success" on:click={() => signalSupport()}>{buttonLabel}</button>{/if}
    </div>
    {#if txId}
    <div>
      <a href={explorerUrl} target="_blank">View on explorer</a>
    </div>
    {/if}
  </div>
  {/if}
</section>

<style>
</style>
