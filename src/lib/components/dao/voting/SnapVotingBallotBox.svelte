<script lang="ts">
import settings from '$lib/settings';
import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import type { ProposalType } from "../../../../types/stxeco.type";
import ChainUtils from '$lib/service/ChainUtils';
import { getOpenContractCall } from '@micro-stacks/svelte';

const contractCall = getOpenContractCall();

export let proposal:ProposalType;
export let balanceAtHeight:number = 0;

const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }

let stacksTipHeight = $settings.info.stacks_tip_height;
let errorMessage:string|undefined;
let txId: string;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;

let amount:number = 0;
const castVote = async (vfor:boolean) => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    if (amount === 0 || amount < 1 || amount > balanceAtHeight) {
      errorMessage = 'Minimum 1 STX max is your balance when voting began';
      return;
    }
    let forCV = trueCV()
    if (!vfor) {
      forCV = falseCV()
    }
    // const amountUSTX = ChainUtils.toOnChainAmount(amount)
    const amountUSTX = ChainUtils.toOnChainAmount(amount)
    const amountCV = uintCV(amountUSTX)
    const proposalCV = contractPrincipalCV(proposal.contractId.split('.')[0], proposal.contractId.split('.')[1])
    await $contractCall.openContractCall({
        postConditions: [],
        postConditionMode: PostConditionMode.Deny,
        contractAddress: deployer,
        contractName: 'ede007-snapshot-proposal-voting',
        functionName: 'vote',
        functionArgs: [amountCV, forCV, proposalCV],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}

$: canVote = stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight;
if (balanceAtHeight === 0 || balanceAtHeight < 1) {
  canVote = false;
}
</script>

{#if canVote}
<div class="bg-card p-5 mt-3 text-white" >
  <div class="row">
    <h4>Cast Your Vote</h4>
    <div class="text-small">Enter the voting power and cast your vote. No STX is transferred by voting.</div>
    {#if !txId}
    <div class="my-3">
      <form on:submit|preventDefault>
        <div class="mb-3 text-center">
          <div class="d-flex justify-content-center"><input class="w-25 form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/> </div>
          <div class="form-text text-white"><a class="mx-5 text-white" href="/" on:click|preventDefault={() => {amount = 1; errorMessage = undefined}}>min</a>  <a class="mx-5 text-white" href="/" on:click|preventDefault={() => {amount = balanceAtHeight; errorMessage = undefined}}>max</a></div>
        </div>
      </form>
      <div class="d-flex justify-content-around">
        <div>
          <button class="px-5 btn btn-outline-warning" on:click={() => {errorMessage = undefined; castVote(true)}}>FOR</button>
        </div>
        <div>
          <button class="px-5 btn btn-outline-warning" on:click={() => {errorMessage = undefined; castVote(false)}}>AGAINST</button>
        </div>
      </div>
      {#if errorMessage}
        <div class="mt-3 text-small text-danger  text-center">{errorMessage}</div>
      {/if}
    </div>
    {:else}
    <div class="my-5">
      <div>Your vote is being counted - thank you.</div>
      <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a></div>
    </div>
    {/if}
  </div>
</div>
{:else}
<div class="bg-card p-5 mt-3 text-white" >
  <div class="row">
    <h4>Unable to to Vote</h4>
    <div class="text-small">Need at least 1 STX in your accoutn at time proposal was submitted.</div>
  </div>
</div>
{/if}

<div class="bg-card py-4 px-5 mt-3">
  <div class="text-white">
    <h4>How Voting Works</h4>
    <p>Vote with at least 1 STX or any amount up to your balance at the block height where voting started. 
    Your wallet balance at block {proposal.proposalData?.startBlockHeight} was {balanceAtHeight} STX.</p>
  </div>
</div>

<style>
  h4 {
    color: #fdad37;
  }
</style>
