<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { getOpenContractCall } from '@micro-stacks/svelte';

const contractCall = getOpenContractCall();

let contractId = $page.params.contractId;
let stacksTipHeight = $settings.info.stacks_tip_height;
export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, concluded: false, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
const endBH = proposalData.endBlockHeight - proposalData.startBlockHeight
const currentBH = stacksTipHeight - proposalData.startBlockHeight
$: currentBHN = (currentBH / endBH) * 100 

const concludeVote = async () => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    await $contractCall.openContractCall({
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: proposal.votingContract || 'unknown',
        functionName: 'conclude',
        functionArgs: [proposalCV],
        onFinish: data => {
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}
</script>

<section class="jumbo mb-5">
  <div class="preview">
    <h4>Voting Schedule</h4>

    {#if stacksTipHeight > proposalData.endBlockHeight}
      {#if proposalData.concluded}
        <div class="py-3 text-center">Vote concluded: </div>
      {:else}
        <div class="py-3 text-center">Too late to vote on this one</div>
        <div class="py-3 text-center"><button class="btn btn-outline-success" on:click={() => concludeVote()}>Conclude this Vote</button></div>
      {/if}
    {:else if stacksTipHeight < proposalData.startBlockHeight}
      <div class="py-3 text-center">Voting starts in {proposalData.startBlockHeight - stacksTipHeight} blocks</div>
    {:else}
    <div class="row mt-5">
      <div cols="12">
        <h4>Block { stacksTipHeight }: Voting in Progress</h4>
        <div class="progress">
          <div class="progress-bar progress-bar-striped" role="progressbar" style={'width:' + (currentBHN) + '%'}
                aria-valuenow={stacksTipHeight - proposalData.startBlockHeight} aria-valuemin="0" aria-valuemax={(proposalData.endBlockHeight - proposalData.startBlockHeight)}>
                &nbsp;
          </div>
        </div>
        <div class="d-flex justify-content-between text-small">
          <div>{ proposalData.startBlockHeight }</div>
          <div>{ proposalData.endBlockHeight }</div>
        </div>
      </div>
    </div>
    {/if}
  </div>
</section>

<style>
</style>
