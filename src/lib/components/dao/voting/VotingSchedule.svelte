<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { getOpenContractCall } from '@micro-stacks/svelte';
import ChainUtils from '$lib/service/ChainUtils';

const contractCall = getOpenContractCall();

let contractId = $page.params.contractId;
let stacksTipHeight = $settings.info.stacks_tip_height;
export const proposal = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, concluded: false, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
const endBH = proposalData.endBlockHeight - proposalData.startBlockHeight
const currentBH = stacksTipHeight - proposalData.startBlockHeight
$: currentBHN = (currentBH / endBH) * 100 
let txId: string;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;

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
          txId = data.txId
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}
</script>

<div class="bg-card py-4 px-5 text-white" >
    {#if stacksTipHeight > proposalData.endBlockHeight}
      {#if proposalData.concluded && proposalData.passed}
        <h4>Vote Passed</h4>
      {:else if proposalData.concluded && !proposalData.passed}
        <h4>Vote Failed to Pass</h4>
      {:else}
        <h4>Voting Closed</h4>
        {#if txId}
        <div class="text-small">Votes are being counted.</div>
        <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a></div>
        {:else}
        <div class="text-small">Please conclude for votes to be counted.</div>
        <div class="py-4"><button class="btn btn-outline-warning" on:click={() => concludeVote()}>Conclude this Vote</button></div>
        {/if}
      {/if}
    {:else if stacksTipHeight < proposalData.startBlockHeight}
      <h4>Voting Opens Soon</h4>
      <div class="text-small">Voting starts in {proposalData.startBlockHeight - stacksTipHeight} blocks</div>
    {:else}
      <h4>Voting Open</h4>
      <p class="text-small">Currently at block { stacksTipHeight } - closes at {proposalData.endBlockHeight}</p>
      <div class="my-5 d-flex justify-content-around text-warning">
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesFor)} votes for</p>
        </div>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesAgainst)} votes against</p>
        </div>
      </div>
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" style={'width:' + (currentBHN) + '%'}
              aria-valuenow={stacksTipHeight - proposalData.startBlockHeight} aria-valuemin={0} aria-valuemax={(proposalData.endBlockHeight - proposalData.startBlockHeight)}>
              &nbsp;
        </div>
      </div>
      <div class="d-flex justify-content-between text-small">
        <div>{ proposalData.startBlockHeight }</div>
        <div>{ proposalData.endBlockHeight }</div>
      </div>
    {/if}
</div>

<style>
  h4 {
    color: #fdad37;
  }
</style>
