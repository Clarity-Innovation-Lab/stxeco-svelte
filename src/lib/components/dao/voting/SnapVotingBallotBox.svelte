<script lang="ts">
import settings from '$lib/settings';
import { contractPrincipalCV, trueCV, falseCV, uintCV } from 'micro-stacks/clarity';
import { PostConditionMode } from 'micro-stacks/transactions';
import type { ProposalType } from "../../../../types/stxeco.type";
import ChainUtils from '$lib/service/ChainUtils';
import { getOpenContractCall } from '@micro-stacks/svelte';
import DaoUtils from '$lib/service/DaoUtils';
import { goto } from "$app/navigation";
import FormatUtils from '$lib/service/FormatUtils';
import {tick, onMount} from 'svelte';

const contractCall = getOpenContractCall();

export let proposal:ProposalType;
export let balanceAtHeight:number = 0;

let stacksTipHeight = $settings?.info?.stacks_tip_height || 0;
const proposalData = proposal.proposalData || { votesFor: 0, votesAgainst: 0, startBlockHeight: 0, endBlockHeight: 0, proposer: '' }
proposal.status = DaoUtils.getStatus(stacksTipHeight, proposal);
const propStatus = proposal.status.name;

let errorMessage:string|undefined;
let txId: string;
$: explorerUrl = import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + import.meta.env.VITE_NETWORK;

$: amount = balanceAtHeight;
const castVote = async (vfor:boolean) => {
    const deployer = import.meta.env.VITE_DAO_DEPLOY_ADDRESS;
    if (amount === 0 || amount < 1 ) {
      errorMessage = 'Minimum voting power is 1 STX';
      return;
    }
    if (amount > balanceAtHeight) {
      errorMessage = 'Maximum voting power is ' + balanceAtHeight + ' STX';
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
        contractName: 'ede007-snapshot-proposal-voting-v5',
        functionName: 'vote',
        functionArgs: [amountCV, forCV, proposalCV],
        onFinish: data => {
          txId = data.txId
          console.log('finished contract call!', data);
          ChainUtils.updateVoters();
          localStorage.setItem('VOTED_FLAG', JSON.stringify(proposal.contractId));
          goto(`/dao/voting/badge/${proposal.contractId}`);
        },
        onCancel: () => {
          console.log('popup closed!');
        }
    });
}

$: canVote = propStatus === 'voting' && stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight;
if (balanceAtHeight === 0 || balanceAtHeight < 1) {
  canVote = false;
}
if (proposal.contractId.indexOf('edp015-sip-015-activation') > -1) {
  canVote = false;
}
onMount(async () => {
  await tick();
  amount = balanceAtHeight;
})

</script>

{#if canVote}
<div class="bg-card p-5 mb-3 text-white" >
  <div class="row">
    <h4  class={'text-' + proposal.status.color}>Cast Your Vote</h4>
    <div class="text-small">
      <p>Enter the voting power and cast your vote.</p>
      <p>Your voting power is the balance you had in the account when voting started - you can vote with anything up to this amount (the minimum voting power is 1 stx). 
      </p>
      <p class="text-warning">
        Your snapshot balance at block <span class="text-bold">{FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight)}</span> was <span class="text-bold">{balanceAtHeight}</span> STX.
      </p>
    </div>
    {#if !txId}
    <div class="my-3">
      <form on:submit|preventDefault>
        <div class="mb-3 text-center">
          <div class="d-flex justify-content-center">
            <input class="w-100 form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/>
          </div>
          {#if amount < balanceAtHeight}
          <div class="d-flex justify-content-end form-text text-small">
            <!-- <a class="mx-5 text-white" href="/" on:click|preventDefault={() => {amount = 1; errorMessage = undefined}}>min</a> -->
            <a class="text-white" href="/" on:click|preventDefault={() => {amount = balanceAtHeight; errorMessage = undefined}}><u>maximum voting power</u></a>
          </div>
          {/if}
        </div>
      </form>
      {#if balanceAtHeight >= 1}
      <p><span class="text-warning">No STX is spent by voting but you will pay a gas fee.</span></p>
      <div class="d-flex justify-content-between">
        <div>
          <button class="px-5 btn btn-success" on:click={() => {errorMessage = undefined; castVote(true)}}>YES ON 2.1</button>
        </div>
        <div>
          <button class="px-5 btn btn-danger" on:click={() => {errorMessage = undefined; castVote(false)}}>NO ON 2.1</button>
        </div>
      </div>
      {:else}
      <div class="mt-3 text-small text-danger  text-center">Not enough balance in this account - must be at least 1 stx</div>
      {/if}
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
  {#if propStatus === 'concluded' || propStatus === 'voting ended'}
    <div class="bg-card p-5 text-white" >
      <div class="row">
        <h4  class={'text-' + proposal.status.color}>Voting Over</h4>
        <div class="text-small">Voting window on this proposal has closed.</div>
      </div>
    </div>
  {:else if propStatus === 'commencing soon' || propStatus === 'voting'}
    <div></div>
  {:else if propStatus !== 'failed' && propStatus !== 'passed'}
    <div class="bg-card p-5 text-white" >
      <div class="row">
        <h4  class={'text-' + proposal.status.color}>Unable to to Vote</h4>
        <div class="text-small">Need at least 1 STX in your account at time proposal was submitted.</div>
      </div>
    </div>
  {/if}
{/if}

<style>
</style>
