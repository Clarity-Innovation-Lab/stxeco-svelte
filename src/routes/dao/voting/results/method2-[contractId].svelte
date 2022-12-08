<script context="module">
  /** @type {import('./$types').RequestHandler} */
export async function load({ params, fetch }) {
  try {
    let url = 'https://api.sip015.xyz/method2-vote';
    let res = await fetch(url);
    if (res.ok) {
        const method2 = await res.json();
				return {
					props: {
            method2
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch')
				}
			}
  } catch (e) {
    // console.log(e);
  }
}
</script>

<script lang="ts">
import { getAccount } from '@micro-stacks/svelte';
import VotingResults from '$lib/components/dao/results/VotingResults.svelte'
import CallButtons1 from '$lib/shared/CallButtons1.svelte'
import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { goto } from '$app/navigation';
import type { ProposalType } from "../../../../types/stxeco.type";

const account = getAccount();

export let contractEvents:any;
export let contractId:string;
export let proposal:ProposalType;

let showVotes = false;
let componentKey = 0;
const color = 'warning';
let sortDir = '';
let sortField = 'voter';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = (sortDir === '-') ? '' : '-';
    componentKey++;
}
const votes: any[] = []
let totalVotePower = 0;
contractEvents.forEach((o:any) => {
  if (o.voteEvent) votes.push(o.voteEvent)
  totalVotePower += o.voteEvent.amount;
});
$: sortedEvents = votes.sort(DaoUtils.dynamicSort(sortDir + sortField));
</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<section>
  <div class="row">
    <div class="cols-12"><h1 class={'text-' + color}><span class={'strokeme-' + color}>Method 2: Pooled Stacked STX Balance</span><br/>{ contractId.split('.')[1] }</h1></div>
    <div class="cols-12"><h4 class="">Votes via <a href="https://sip015.xyz/" target="_blank">stacking in a pool</a>.</h4></div>
  </div>
  <div class="row">
    <div class="cols-12 text-end my-3">
      <p class="w-100 text-right">
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { showVotes = !showVotes }}>show all votes</button>
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { goto(`/dao/proposals/${contractId}`) }}>back</button>
      </p>
    </div>
  </div>
  <VotingResults {proposal} />

  {#if showVotes}
  <div class="row">
    <div class="cols-12 my-3">
      <table class="table text-white">
        <thead>
          <tr>
            <th scope="col" class="pointer" on:click={() => reorder('voter')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Voter</th>
            <th scope="col" class="pointer" on:click={() => reorder('amount')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Power</th>
            <th scope="col" class="pointer" on:click={() => reorder('for')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} For/Against</th>
          </tr>
        </thead>
        <tbody>
      {#key componentKey}
      {#each sortedEvents as item}
        <tr>
        <th scope="row" class={(item.voter === $account.stxAddress) ? 'text-success' : ''} title={(item.voter === $account.stxAddress) ? 'I voted!' : ''}>{item.voter}</th>
        <td class="py-3">{@html ChainUtils.fromOnChainAmount(item.amount)}</td>
        <td class="py-3">{@html (item.for) ? '<span class="text-warning">for</span>' : 'against'}</td>
      </tr>
      {/each}
      {/key}
  </tbody>
</table>
</div>
</div>
{/if}
<p class="my-5 text-center">
    <CallButtons1 />
  </p>
</section>

<style>
section {
  font-family: Gilroy-Light;
}
.part0 {
  font-size: 1.2rem;
  font-weight: 700;
}
.part1 {
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
