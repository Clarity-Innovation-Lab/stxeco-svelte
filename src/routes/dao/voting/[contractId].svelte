<script context="module">
  /** @type {import('./$types').RequestHandler} */
export async function load({ params, fetch }) {
  try {
    const contractId = params.contractId;
    let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/events/proposal/' + contractId;
    let res = await fetch(url);
    if (res.ok) {
        const contractEvents = await res.json();
				return {
					props: {
            contractId,
            contractEvents
					}
				}
			} else {
				return {
					status: res.status,
					error: new Error('Could not fetch issues')
				}
			}
  } catch (e) {
    // console.log(e);
  }
}
</script>

<script lang="ts">
import settings from '$lib/settings';
import { getAccount } from '@micro-stacks/svelte';
import CallButtons1 from '$lib/shared/CallButtons1.svelte'
import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
import DaoUtils from '$lib/service/DaoUtils';
import ChainUtils from '$lib/service/ChainUtils';
import { goto } from '$app/navigation';

const account = getAccount();

export let contractEvents:any;
export let contractId:string;

let componentKey = 0;
const stacksTipHeight = $settings.info?.stacks_tip_height || 0;
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
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<section>
  <div class="row">
    <div class="cols-12"><h1 class={'text-' + color}><span class={'strokeme-' + color}>Voting History</span><br/>{ contractId.split('.')[1] }</h1></div>
    <div class="cols-12"><p class="strapline">Total voting power is {@html ChainUtils.fromOnChainAmount(totalVotePower)} with votes cast from {contractEvents.length} accounts.</p></div>
  </div>
  <div class="row">
    <div class="cols-12 text-end my-3">
      <p class="w-100 text-right">
        <button class={'btn btn-outline-' + color} on:click|preventDefault={() => { goto(`/dao/proposals/${contractId}`) }}>back</button>
      </p>
    </div>
  </div>
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
        <th scope="row" class="py-3">{item.voter}</th>
        <td class="py-3">{@html ChainUtils.fromOnChainAmount(item.amount)}</td>
        <td class="py-3">{@html (item.for) ? '<span class="text-warning">for</span>' : 'against'}</td>
      </tr>
    {/each}
    {/key}
  </tbody>
</table>
</div>
</div>
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
