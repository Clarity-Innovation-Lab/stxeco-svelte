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

let canVote = stacksTipHeight >= proposalData.startBlockHeight && stacksTipHeight < proposalData.endBlockHeight;
if (balanceAtHeight === 0 || balanceAtHeight < 1) {
  canVote = false;
}
</script>

<section>
  <div class="jumbo">
    <div>
      <h4>Snapshot Voting</h4>
      <p>Vote with at least 1 STX or any amount up to your balance at the block height where voting started. 
      Your wallet balance at block {proposal.proposalData?.startBlockHeight} was {balanceAtHeight} STX.</p>
  </div>
  {#if canVote}
  <div class="row">
		<form on:submit|preventDefault>
			<div class="mb-3 text-center">
				<div class="form-text"><h6>Voting Power</h6></div>
				<div class="form-text"><a href="/" on:click|preventDefault={() => amount = 1}>min</a> / <a href="/" on:click|preventDefault={() => amount = balanceAtHeight}>max</a></div>
				{#if errorMessage}
        <div class="text-small text-danger">{errorMessage}</div>
        {/if}
				<div class="d-flex justify-content-center"><input class="w-25 form-control" bind:value={amount} type="number" id="Contribution" aria-describedby="Contribution"/> </div>
				<div class="mt-5 text-small text-info">No STX is transferred by voting.</div>
			</div>
		</form>
    <div class="my-5">
      <div class="d-flex justify-content-around">
        <div>
          <div>
            <button class="btn btn-outline-info" on:click={() => castVote(true)}>FOR</button>
          </div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesFor)} votes</p>
        </div>
        <h2>Cast your Vote</h2>
        <div>
          <div>
            <button class="btn btn-outline-success" on:click={() => castVote(false)}>AGAINST</button>
          </div>
          <p class="text-center">{ChainUtils.fromMicroAmount(proposalData.votesAgainst)} votes</p>
      </div>
    </div>
    </div>
  </div>
  {/if}
  {#if txId}
  <div>Your vote is being counted - thank you.</div>
  <div><a href={explorerUrl} target="_blank">Track progress on the explorer</a>.</div>
  {/if}
</div>
</section>

<style>
</style>
