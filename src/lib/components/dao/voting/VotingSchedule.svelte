<script lang="ts">
import { page } from '$app/stores';
import settings from '$lib/settings';
import { contractPrincipalCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import { getOpenContractCall } from '@micro-stacks/svelte';
import ChainUtils from '$lib/service/ChainUtils';
import type { ProposalType } from "../../../../types/stxeco.type";
import DaoUtils from '$lib/service/DaoUtils';

const contractCall = getOpenContractCall();

let contractId = $page.params.contractId;
let stacksTipHeight = $settings.info.stacks_tip_height;
export let proposal:ProposalType; // = $settings.proposals?.find((p) => p.contract.contract_id === contractId);
proposal.status = DaoUtils.getStatus(stacksTipHeight, proposal);
if (!proposal) throw new Error('Unexpected empty proposal for id: ' + contractId);
const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, concluded: false, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
const endBH = proposalData.endBlockHeight - proposalData.startBlockHeight
const currentBH = stacksTipHeight - proposalData.startBlockHeight
$: currentBHN = (currentBH / endBH) * 100 
let txId: string;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;


const inFavour = (proposalData && (proposalData.votesFor + proposalData.votesAgainst) > 0) ? Number(((proposalData.votesFor / (proposalData.votesFor + proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
let winning = 'danger';
if (inFavour > 80) {
  winning = 'success';
}

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

<div class="bg-card py-4 px-5 mb-3">
    {#if stacksTipHeight > proposalData.endBlockHeight}
      {#if proposalData.concluded && proposalData.passed}
        <h4 class={'text-' + proposal.status.color}>Vote Passed</h4>
        <div class={'mb-4 d-flex justify-content-around text-' + winning}>
          <div>
            <span class="text-center">{inFavour}%</span> <span class="text-white"> in favour of this proposal</span>
          </div>
        </div>
        {:else if proposalData.concluded && !proposalData.passed}
        <h4 class={'text-' + proposal.status.color}>Vote Failed to Pass</h4>
        <div class={'mb-4 d-flex justify-content-around text-' + winning}>
          <div>
            <span class="text-center">{100 - inFavour}%</span> <span class="text-white"> against this proposal</span>
          </div>
        </div>
      {:else}
        <h4 class={'text-' + proposal.status.colorCode}>Voting Closed</h4>
        {#if txId}
        <div class="text-small">Votes are being counted.</div>
        <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a></div>
        {:else}
        <div class="text-small">Please conclude for votes to be counted.</div>
        <div class="py-4"><button class={'btn btn-outline-' + proposal.status.color} on:click={() => concludeVote()}>Conclude this Vote</button></div>
        {/if}
      {/if}
      <div class={'my-5 d-flex justify-content-around text-' + proposal.status.color}>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesFor)} <span class="text-white">votes for</span></p>
        </div>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesAgainst)} <span class="text-white">votes against</span></p>
        </div>
      </div>
    {:else if stacksTipHeight < proposalData.startBlockHeight}
      <h4 class={'text-' + proposal.status.color}>Voting Opens Soon</h4>
      <div class="text-small text-white">Voting starts in {proposalData.startBlockHeight - stacksTipHeight} blocks</div>
    {:else}
      <h4 class={'text-' + proposal.status.color}>Voting Open</h4>
      <p class="text-small text-white">Currently at block { stacksTipHeight } - closes at {proposalData.endBlockHeight}</p>
      <div class={'mt-5 d-flex justify-content-around text-' + proposal.status.color}>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesFor)} <span class="text-white">votes for</span></p>
        </div>
        <div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesAgainst)} <span class="text-white">votes against</span></p>
        </div>
      </div>
      <div class={'mb-4 d-flex justify-content-around text-' + winning}>
        <div>
          <span class="text-center">{inFavour}%</span> <span class="text-white"> currently in favour of this proposal</span>
        </div>
      </div>
      <div class="progress">
        <div class="progress-bar progress-bar-striped" role="progressbar" style={'width:' + (currentBHN) + '%'}
              aria-valuenow={stacksTipHeight - proposalData.startBlockHeight} aria-valuemin={0} aria-valuemax={(proposalData.endBlockHeight - proposalData.startBlockHeight)}>
              &nbsp;
        </div>
      </div>
      <div class="d-flex justify-content-between text-small text-white">
        <div>{ proposalData.startBlockHeight }</div>
        <div>{ proposalData.endBlockHeight }</div>
      </div>
    {/if}
</div>

<style>
  .progress {
    border-radius: none !important;
  }
  .progress-bar {
    border-radius: none !important;
  }
</style>
