<script lang="ts">
  import settings from '$lib/settings';
	import Modal from '$lib/shared/Modal.svelte';
	import ClaritySytaxHighlighter from '$lib/shared/ClaritySytaxHighlighter.svelte';
  import ProposalFilter from '$lib/components/dao/proposals/ProposalFilter.svelte'
  import { SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
  import { goto } from '$app/navigation';
  import type { ProposalType } from "../../../types/stxeco.type";
	import DaoUtils from '$lib/service/DaoUtils';
	import { page } from '$app/stores';


  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal;
	}

  const sigsRequired = Number($settings.daoProperties?.find((o) => o.id === 'get-signals-required')?.value) || 0;
  const network = import.meta.env.VITE_NETWORK;
  const explorer = import.meta.env.VITE_STACKS_EXPLORER;
  const isFiltered = $page.url.searchParams.has('filter');
  const filter = (isFiltered) ? $page.url.searchParams.get('filter') : 'All Proposals';
  $: currentFilter = filter;
	const propFilterChange = (e: { detail: string; }) => {
		currentFilter = e.detail
	}
	$: matchesFilter = (item:ProposalType) => {
		if (currentFilter === 'All Proposals') return true;
    if (currentFilter === 'executed') {
      return item.executedAt && item.executedAt > 0;
    }
    if (currentFilter === 'deployed') {
      return item.status === 'deploying' || item.status === 'deployed';
    }
    if (currentFilter === 'submitted') {
      return item.status === 'submitted' || item.status === 'submitting';
    }
    return currentFilter === item.status || currentFilter === 'all';
	}
  
	const fundingCost = Number($settings.daoProperties?.find((o) => o.id === 'funding-cost')?.value) / 1000000 || 0;

  const contractUrl = (txId:string) => {
      return explorer + '/txid/' + txId + '?chain=' + network;
  }

  let prop:ProposalType;
  let sourceCode: string|undefined = '';
  const openSesame = (currentItem:ProposalType) => {
    prop = currentItem;
    sourceCode = currentItem.contract.source_code;
    toggleModal();
  }
  const deployProposal = () => {
    goto('/dao/proposals/deployment', { replaceState: false }) 
  }
  const stacksTipHeight = $settings.info?.stacks_tip_height || 0;

  $settings.proposals?.forEach((item) => {
    item.status = DaoUtils.getStatus(stacksTipHeight, item);
  })

  const status = (item:ProposalType) => {
    item.status = DaoUtils.getStatus(stacksTipHeight, item);
    return item.status;
  }

  const classList = (item:ProposalType) => {
    let clazzes = 'py-3';
    if (typeof item.executedAt === 'number' && item.executedAt > 0) {
      clazzes = 'py-3 bg-success text-white';
    } else if (item.funding > -1 && item.funding < fundingCost) {
      clazzes = 'py-3 bg-warning text-white';
    } else if (item.funding > -1 && item.funding >= fundingCost) {
      clazzes = 'py-3 bg-danger text-white';
    }
    return clazzes;
  }

  let sortDir = true;
  let sortField = 'title';

  const reorder = (sf:string) => {
    sortField = sf;
    sortDir = !sortDir;
  }
  $: sortedProps = DaoUtils.sortProposals($settings?.proposals, sortDir, sortField);
  </script>
  
  <svelte:head>
    <title>DAO Proposals</title>
    <meta name="description" content="Ecosystem DAO proposals" />
  </svelte:head>
  
  <Modal {showModal} on:click={toggleModal}>
    <div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
    <div slot="title">
      <h3>Proposal: {prop?.contract?.contract_id?.split('.')[1]}</h3>
    </div>
  </Modal>
  
  <section>
  </section>

  <section>
    <div class="container">

      <div class="d-flex justify-content-end mb-4">
        <div class="mx-3">
          <button class="btn btn-outline-dark" on:click|preventDefault={() => { deployProposal() }}>
            Deploy a Proposal Contract
          </button>  
        </div>
        <div>
          <ProposalFilter {currentFilter} on:propFilterChange={propFilterChange}/>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col" class="pointer my-2" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</th>
                <th scope="col" class="pointer my-2" on:click={() => reorder('status')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} State</th>
                <th scope="col" class="pointer my-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedProps as item}
                {#if item && matchesFilter(item)}
                <tr>
                  <td class={classList(item)}><a class="text-white" href={'/dao/proposals/' + item.contract.contract_id}>{item.contractId.split('.')[1]}</a></td>
                  <td class={classList(item)}>
                    {status(item)}
                    {#if status(item) === 'emergexec'}(<a class="pointer text-info" href={'/dao/proposals/' + item.contract.contract_id}><span class="text-white">{item.emergencySignals}/{sigsRequired}</span></a>){/if}
                    {#if status(item) === 'voting'} - <a class="pointer text-info" href={'/dao/proposals/' + item.contract.contract_id}><span class="text-white">{DaoUtils.getVotingMessage(item.proposalData, stacksTipHeight)}</span></a>{/if}
                    {#if status(item) === 'funding'}(<a class="pointer text-info" href={'/dao/proposals/' + item.contract.contract_id}><span class="text-white">{item.funding}/{fundingCost}</span></a>){/if}
                  </td>
                  <td class={classList(item)}>
                    <div class="dropdown">
                      <span class="dropdown px-3" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        ...
                      </span>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item pointer text-info" href="/" on:click|preventDefault={() => { openSesame(item) }}>Show Clarity Source Code</a>
                        <a class="dropdown-item pointer text-info" href={contractUrl(item.contractId)} target="_blank">Show on Explorer</a>
                      </div>
                    </div>
                  </td>
                </tr>
                {/if}
              {/each}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  
  <style>
  </style>
  