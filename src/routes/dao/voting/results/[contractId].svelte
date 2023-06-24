<script context="module">
  /** @type {import('./$types').RequestHandler} */
export async function load({ params, fetch }) {
  try {
    const contractId = params.contractId;
    let url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/proposal/' + contractId;
    let res = await fetch(url);
    const proposal = await res.json();
    //url = 'https://api.sip015.xyz/method2-vote-details';
    //res = await fetch(url);
    //const method2 = await res.json();
    url = 'https://api.sip015.xyz/method2-vote-details';
    res = await fetch(url);
    const method1 = await res.json();
    url = 'https://stx.eco/daoapi/v2/twoone/results/method2?balanceKey=stxBalance1';
    res = await fetch(url);
    const method2a = await res.json();
    url = import.meta.env.VITE_CLARITYLAB_API + '/daoapi/v2/events/proposal/' + contractId;
    res = await fetch(url);
    if (res.ok) {
        const contractEvents = await res.json();
				return {
					props: {
            //method2,
            method1,
            method2a,
            proposal,
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
import Method1 from '$lib/components/dao/results/Method1.svelte'
import Method2a from '$lib/components/dao/results/Method2a.svelte'
//import Method2 from '$lib/components/dao/results/Method2.svelte'
import Method3 from '$lib/components/dao/results/Method3.svelte'
import CallButtons1 from '$lib/shared/CallButtons1.svelte'
import type { ProposalType } from "../../../../types/stxeco.type";

//export let method2:any;
export let method1:any;
export let method2a:any;
export let contractEvents:any;
export let contractId:string;
export let proposal:ProposalType;

const color = 'warning';
const votes: any[] = []
let totalVotePower = 0;
contractEvents.forEach((o:any) => {
  if (o.voteEvent) votes.push(o.voteEvent)
  totalVotePower += o.voteEvent.amount;
});
const scrollTo = (section: number) => {
  const getMeTo = document.getElementById("method-" + section);
  if (getMeTo) getMeTo.scrollIntoView({behavior: 'smooth'});
  return section;
}
const inFavour3 = (proposal.proposalData && (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst) > 0) ? Number(((proposal.proposalData.votesFor / (proposal.proposalData.votesFor + proposal.proposalData.votesAgainst)) * 100).toFixed(2)) : 0;
//const inFavour2 = (method2) ? Number(((method2.metadata.totalAmounts.yes / (method2.metadata.totalAmounts.yes + method2.metadata.totalAmounts.no)) * 100).toFixed(2)) : 0;
const inFavour2 = (method2a) ? Number(((method2a.countFor / (method2a.countFor + method2a.countAgainst)) * 100).toFixed(2)) : 0;
const inFavour1 = 100.00; //(method2) ? Number(((method2.metadata.totalAmounts.yes / (method2.metadata.totalAmounts.yes + method2.metadata.totalAmounts.no)) * 100).toFixed(2)) : 0;

</script>

<svelte:head>
	<title>Ecosystem DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<section id="results-section">
  <div class="row">
    <div class="cols-12"><h1 class={'text-' + color}><span class={'strokeme-' + color}>Stacks 2.1 Upgrade</span> Voting Results</h1></div>
  </div>
  <div class="bg-card my-5 text-white" style="font-size: 1.4rem;">
    <div class="row p-4">
      <div class="col-6">Method 1: Stacking Solo</div>
      <div class="col-5">
        <span class="text-success">{inFavour1}% FOR</span>
      </div>
      <div class="col-1">
        <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTo(1)}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_down.png" alt="Scroll down" width="20" height="auto" /></a>
      </div>
    </div>
    <div class="row p-4">
      <div class="col-6">Method 2: Stacking in a Pool</div>
      <div class="col-5">
        <span class="text-success">{inFavour2}% FOR</span>
      </div>
      <div class="col-1">
        <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTo(2)}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_down.png" alt="Scroll down" width="20" height="auto" /></a>
      </div>
    </div>
    <div class="row p-4">
      <div class="col-6">Method 3: Liquid STX Balance</div>
      <div class="col-5">
        <span class="text-success">{inFavour3}% FOR</span>
      </div>
      <div class="col-1">
        <a href="/" class="pointer text-akrobat-thin" on:click|preventDefault={() => scrollTo(3)}><img class="mx-2" src="/img/png-assets/stx_eco_arrow_down.png" alt="Scroll down" width="20" height="auto" /></a>
      </div>
    </div>  
  </div>

  <div class="my-5" id="method-1">
    <Method1 {method1} />
  </div>
  <!--
  <div class="my-5" id="method-2">
    <Method2 {method2} />
  </div>
  -->
  <div class="my-5" id="method-2">
    <Method2a {method2a} />
  </div>
  <div class="my-5" id="method-3">
    <Method3 {proposal} {contractEvents} />
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
