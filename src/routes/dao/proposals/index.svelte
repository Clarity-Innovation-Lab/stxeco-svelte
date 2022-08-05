<script lang="ts">
  import settings from '$lib/settings';
	import Modal from '$lib/shared/Modal.svelte';
  import ProposalFilter from '$lib/components/dao/proposals/ProposalFilter.svelte'
  import { Gear, ArrowUpRightCircle, CodeSlash, SortAlphaDown, SortAlphaUp } from "svelte-bootstrap-icons";
  import { goto } from '$app/navigation';
  import type { ProposalType } from "../../../types/stxeco.type";
	import DaoUtils from '$lib/service/DaoUtils';

  let showModal:boolean;
	const toggleModal = () => {
		showModal = !showModal;
	}

  const network = import.meta.env.VITE_NETWORK;
  const explorer = import.meta.env.VITE_STACKS_EXPLORER;
  $: currentFilter = 'All Proposals';
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
  const openSesame = (currentItem:ProposalType) => {
    prop = currentItem;
    toggleModal();
  }
  const openProposal = (currentItem:ProposalType) => {
    goto(`/dao/proposals/${currentItem.contract.contract_id}`, { replaceState: false }) 
  }
  const submitProposal = (currentItem:ProposalType) => {
    goto(`/dao/proposals/submission/${currentItem.contractId}`, { replaceState: false }) 
  }
  const fundProposal = (currentItem:ProposalType) => {
    goto(`/dao/proposals/submission/fund-${currentItem.contractId}`, { replaceState: false }) 
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
    if (item.executedAt > 0) {
      clazzes = 'py-3 bg-success text-white';
    } else if (item.funding > 0 && item.funding < fundingCost) {
      clazzes = 'py-3 bg-warning text-white';
    } else if (item.funding > 0 && item.funding >= fundingCost) {
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

  $: sortedProps = DaoUtils.sortProposals($settings.proposals, sortDir, sortField);

  </script>
  
  <svelte:head>
    <title>DAO Proposals</title>
    <meta name="description" content="Ecosystem DAO proposals" />
  </svelte:head>
  
  <Modal {showModal} on:click={toggleModal}>
    <div class="source-modal"><pre style="width: 95%">{prop.contract.source_code}</pre></div>
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
          <table class="table table-striped text-small">
            <thead>
              <tr>
                <th scope="col" class="pointer" on:click={() => reorder('title')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} Title</th>
                <th scope="col" class="pointer" on:click={() => reorder('status')}>{#if sortDir}<SortAlphaDown/>{:else}<SortAlphaUp/>{/if} State</th>
                <th scope="col">Proposed By</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedProps as item}
                {#if item && matchesFilter(item)}
                <tr>
                  <th class={classList(item)} scope="row"><a class="text-info" href={'/dao/proposals/' + item.contract.contract_id}>{item.contractId.split('.')[1]}</a></th>
                  <td class={classList(item)}>
                    {status(item)} 
                    {#if status(item) === 'emergexec'}(<a class="pointer text-info" href="/" on:click|preventDefault={() => { submitProposal(item) }}>{item.emergencySignals}</a>){/if}
                    {#if item.funding > 0}(<a class="pointer text-info" href="/" on:click|preventDefault={() => {fundProposal(item) }}>{item.funding}/{fundingCost}</a>){/if}
                  </td>
                  <td class={classList(item)}>{item.proposer}</td>
                  <td class={classList(item)}>
                    <div class="dropdown">
                      <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Gear fill="purple" width={20} height={20} />
                      </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openSesame(item) }}><CodeSlash fill="purple" width={20} height={20} /> Show Clarity Source Code</a>
                        <a class="dropdown-item mb-2 border-bottom pointer text-info" href={contractUrl(item.contractId)} target="_blank"><ArrowUpRightCircle fill="purple" width={20} height={20} /> Show on Explorer</a>
                        <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openProposal(item) }} target="_blank"><ArrowUpRightCircle fill="purple" width={20} height={20} /> Open Proposal</a>
                        {#if item.status === 'deployed'}
                          <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { submitProposal(item) }}><ArrowUpRightCircle fill="purple" width={20} height={20} /> Submit Proposal</a>
                          {:else if item.status === 'submitted'}
                          <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { openProposal(item) }}><ArrowUpRightCircle fill="purple" width={20} height={20} /> Vote on Proposal</a>
                        {/if}
                        {#if item.funding > 0 && item.funding < fundingCost}
                          <a class="dropdown-item mb-2 border-bottom pointer text-info" href="/" on:click|preventDefault={() => { fundProposal(item) }}><ArrowUpRightCircle fill="purple" width={20} height={20} /> Fund Proposal</a>
                        {/if}
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
    /**
    section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    **/
  </style>
  