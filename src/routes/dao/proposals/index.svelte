<script lang="ts">
import settings from '$lib/settings';
import Modal from '$lib/shared/Modal.svelte';
import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
import ProposalFilter from '$lib/components/dao/proposals/ProposalFilter.svelte'
import ProposalGridItem from '$lib/components/dao/proposals/ProposalGridItem.svelte'
import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
import { goto } from '$app/navigation';
import type { ProposalType } from "../../../types/stxeco.type";
import DaoUtils from '$lib/service/DaoUtils';
import { page } from '$app/stores';
import { onMount } from 'svelte';


let showModal:boolean;
const toggleModal = () => {
  showModal = !showModal;
}
let componentKey = 0;
let filter = 'All Proposals';  
let proposal:ProposalType;
let sourceCode: string|undefined = '';
const openSourceModal = (evt) => {
  proposal = evt.detail;
  sourceCode = proposal.contract.source_code;
  toggleModal();
}
const deployProposal = () => {
  goto('/dao/proposals/deployment', { replaceState: false }) 
}

$: matchesFilter = (proposal:ProposalType) => {
  // const filterValues = ['all', 'emergexec', 'voting', 'funding', 'concluded', 'deployed', 'draft']
  const status = proposal.status;
  if (currentFilter === 'All Proposals' || currentFilter === 'all') return true;
  if (currentFilter === 'executed') {
    return status.name === 'emergexec' || status.name === 'passed' || status.name === 'failed';
  }
  if (currentFilter === 'deployed' || currentFilter === 'draft') {
    return status.name === 'draft' || status.name === 'deployed' || status.name === 'deploying' || status.name === 'submitted' || status.name === 'submitting';
  }
  if (currentFilter === 'voting') {
    return status.name === 'voting ended' || status.name === 'voting' || status.name === 'commencing soon';
  }
  if (currentFilter === 'concluded') {
    return status.name === 'voting ended' || status.name === 'passed' || status.name === 'failed';
  }
  if (currentFilter === 'funding') {
    return status.name === 'funding';
  }
  return currentFilter === status.name || currentFilter === 'all';
}

onMount(async () => {
  const isFiltered = $page.url.searchParams.has('filter');
  filter = (isFiltered) ? $page.url.searchParams.get('filter') : 'All Proposals';
});
let sortDir = true;
let sortField = 'title';
const reorder = (sf:string) => {
    sortField = sf;
    sortDir = !sortDir;
    componentKey++;
}
$: sortedProps = DaoUtils.sortProposals($settings.proposals, sortDir, sortField);
$: currentFilter = filter;
const propFilterChange = (e: { detail: string; }) => {
		currentFilter = e.detail
}
</script>
  
  <svelte:head>
    <title>DAO Proposals</title>
    <meta name="description" content="Ecosystem DAO proposals" />
  </svelte:head>
  
  <Modal {showModal} on:click={toggleModal}>
    <div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
    <div slot="title">
      <h3>Proposal: {proposal?.contract?.contract_id?.split('.')[1]}</h3>
    </div>
  </Modal>
  
  <section>
  </section>

  <section>
    <div class="row">
      <div class="cols-12">
        <h1 class="text-white"><span class="strokeme-white">DAO</span> Proposals</h1>
        <p class="strapline">Proposals are the lifeblood of the DAO - anyone can suggest a proposal
          but to have a proposal accepted for voting requires STX to be sent to the DAO. This helps
          fund the work of the DAO and also prevents the DAO from being spammed with trivial proposals.
          To make it inclusive and fair we've included support for crowd funding proposals, so you don't have to 
          be loaded to make a proposal.
        </p>
        <p class="text-center">
          <button class="btn btn-outline-light" on:click|preventDefault={() => { deployProposal() }}>make a proposal</button>
        </p>
      </div>
      <div class="cols-12">
        <div class="m-5 d-flex justify-content-center">
        <div class="filter pointer m-2" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</div>
        <div class="filter pointer m-2" on:click={() => reorder('status')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Status</div>
        <div class="filter pointer m-2"><ProposalFilter {currentFilter} on:propFilterChange={propFilterChange}/></div>
      </div>
    </div>
    <div class="cols-12">
      <div class="row">
        {#key componentKey}
          {#each sortedProps as item}
            {#if item && matchesFilter(item)}
              <div class="col-md-6 col-sm-12"><ProposalGridItem proposal={item}  on:openSourceModal={openSourceModal}/></div>
            {/if}
          {/each}
        {/key}
      </div>
    </div>
  </div>
</section>
  
  <style>
.filter {
      border: 1pt solid #787878;
      color: #787878;
      padding: 3px 17px;
}
.btn {
  border: 1pt solid #ededed;
  font-size: 1.2rem;
  border-radius: 50px!important;
  color: #ededed;
  padding: 15px 5px;
  width: 250px;
  letter-spacing: 0.2rem;
}
</style>
  